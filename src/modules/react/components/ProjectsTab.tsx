import { ReactNode, useContext, useEffect, useSyncExternalStore, Key, useReducer, Fragment } from "react";
import { Developer } from "../../User";
import { MailboxStore, ProjectStore } from "../store/UserStore";
import { Project } from "../../project";
import { useLoadingStore } from "./LoadingStore";
import { Background } from "./background";
import { themeContext } from "../context/ThemeContext";
import { ProgressBar } from "./ProgressBar";
import { TimeConstraints } from "../../Timeconstraints";
import { Button } from "./Button";
import { FeatureReducer } from "./reducers/FeatureReducer";
import { Feature, getActiveDevelopmentTasks, getPendingDevelopmentTasks  } from "../../feature";
import { Task } from "../../Task";
import { get } from "node:http";
import { ThemeValues } from "../../theme";
import { JSX } from "react/jsx-runtime";
import { FeatureTableRows } from "./FeatureTableRows";
import { AddFeaturesElement } from "./AddFeaturesElement";
import { AddTaskElement } from "./AddTaskElement";
import { ProjectSchedule } from "./ProjectSchedule";



export type ProjectsTabProp = {
    /**
     * 
     */
    projectList: string[],

}

export function ProjectsTab() {
    let keysNeededForProjectsList: Key[];
    const projectStore = useSyncExternalStore(ProjectStore.subscribe, ProjectStore.getSnapshotProjects);
    const mailBoxStore = useSyncExternalStore(MailboxStore.subscribe, MailboxStore.getSnapshotMailbox);
    let loadingStore = useLoadingStore();
    const appThemeContext = useContext(themeContext);
    useEffect(() => ProjectStore.getProjects, [mailBoxStore]);
    let activeProjects: Project[] | null = projectStore;

    const [state, dispatcher] = useReducer(FeatureReducer, null);




    if (activeProjects !== null) {

        keysNeededForProjectsList = getKeysForList(activeProjects);



    }






    return (<>
        {loadingStore ? (<>
            <img className="loading-indicator" src='https://icons8.com/preloaders/preloaders/1480/Fidget-spinner-128.gif'>

            </img>
        </>) : (<>


        </>)}

        {
            activeProjects !== null && (

                <>
                    {activeProjects.map((project, index) => {


                        return (<Fragment key={keysNeededForProjectsList[index]}>
                            <ProjectView project={project} ></ProjectView></Fragment>)
                    })}
                </>
            )

        }
    </>)

}
export type AddFeaturesElementProps = {
    /**
     * The dev team assigned to the specific project or null if none are.
     * 
     * Will be used to give suggestions for appropriate developers, that is, devs that belong to the project already in 
     * second hand and that has the type of the thought feature, if such a type has been set, in first hand
     */
    projectDevTeam: Developer[] | null,
    /**
     * The time constraints of the project, we do not accept features that go outside of these bounds
     */
    projectTimeConstraints: TimeConstraints,

    onSubmitFeature: (title: string, description: string, type: string, timeconstraints: TimeConstraints, developersAssigned: Developer[] | null) => void





}

type FeatureOverviewProps = {

    features: Feature[] | null,

    handleStatusChange: ((action: any) => void),

}

type ProjectViewProps = {

    reactKey: Key,

    project: Project
}

function ProjectView({ project }: ProjectViewProps) {
    const appThemeContext = useContext(themeContext);

    function handleSubmitFeature(title: string, description: string, type: string, timeconstraints: TimeConstraints, developersAssigned: Developer[] | null) {


        //Can always be called, instantiates a Feature[] if none exists
        // action.type : ADD_FEATURE {
        //      action.payload.title : string,
        //      action.payload.type : string,
        //      action.payload.description : string,
        //      //timeconstraints must be given for a feature
        //      action.payload.timeconstraints : TimeConstraints,
        //      //if developmentTasks are left as null, the first dev-task becomes "Plan project" with all assigned devs assigned to it
        //      action.payload.developmentTasks : Task[]|null,
        //      action.payload.assignedDevelopers : Developer[] | null,


        //  }

        let devTask = new Task(type, `Plan implementantation of  ${title}`, timeconstraints, developersAssigned, null, "Pending");

        const action = { type: "ADD_FEATURE", payload: { title: title, description: description, type: type, timeconstraints: timeconstraints, developmentTasks: [devTask], assignedDevelopers: developersAssigned } }
        dispatcher(action);

    }

    function handleUpdateProject( newFeatures : Feature[]|null){
        if(newFeatures !== null){
        for(let i = 0 ; i < newFeatures?.length ; i++){
            let featureToAdd = new Feature(newFeatures[i].title, newFeatures[i].type, newFeatures[i].description, newFeatures[i].timeconstraints, newFeatures[i].developmentTasks, newFeatures[i].assignedDevelopers );
            project.addFeature(featureToAdd);
        }
    }
        ProjectStore.updateProject(project);
    }

    const [state, dispatcher] = useReducer(FeatureReducer, project.features);

    function getTimeFraction(timeConstraints: TimeConstraints) {

        const startDate = Date.parse(timeConstraints._startdate);
        const endDate = Date.parse(timeConstraints._enddate);

        const currentDate = Date.now();

        const totalTime = endDate - startDate;

        const timePassed = currentDate - startDate;

        return timePassed / totalTime * 100;


    }

    return <Background cssClassName="project-details-container" backgroundColor={appThemeContext.tertiaryContentColor}>

        <ProgressBar barColor={appThemeContext.tertiaryContrastColor} progress={(getTimeFraction(project.timeconstraints))} />
        <details className="project-details-element">
            <summary><b>{`${project.title} : ${project.timeconstraints._startdate} -> ${project.timeconstraints._enddate}`} </b></summary>


            <h4>Description : </h4>
            <textarea defaultValue={`${project.description}`} disabled={false}>

            </textarea>

           

                <ProjectSchedule projectDevs={project.developerTeam} features={state}></ProjectSchedule>




           
                <AddFeaturesElement onSubmitFeature={handleSubmitFeature} projectDevTeam={project.developerTeam} projectTimeConstraints={project.timeconstraints}>

                </AddFeaturesElement>




            <FeatureOverview handleStatusChange={dispatcher} features={state} />

            <AddTaskElement handleAddTask={(type, description, timeconstraints, assignDevelopers, selectedFeatureIndex) => {
                //Make action object with complete payload and type === "ADD_DEVELOPMENT_TASK"
                const newTask = new Task(type, description, timeconstraints, assignDevelopers, null, "Pending");
                const action = {
                    type: "ADD_DEVELOPMENT_TASKS",
                    payload: {
                        featureIndex: selectedFeatureIndex,
                        timeconstraints: timeconstraints,
                        devTask: newTask
                    }
                };

                dispatcher(action);



            }} features={state}></AddTaskElement>



        </details>

        <Button cssClassName="update-project-button" isDisabled={false} onClick={(e)=>{
                e.preventDefault();
                e.stopPropagation();
            handleUpdateProject(state);
        }} > {"Update project (Will save changes)"}</Button>

    </Background>;

    <hr></hr>
}

function FeatureOverview({ handleStatusChange, features }: FeatureOverviewProps): ReactNode {





    if (features === null) {

        return <></>
    }
    else {



        const keysForFeatures = getKeysForList(features);
        let assignedDevList: ReactNode = (<></>)
        const appThemeContext = useContext(themeContext);
        let tableRows = (<></>)
        return features.map((feature, index) => {

            if (feature.developmentTasks !== null) {

                let assignedFeatureDevelopers = feature.assignedDevelopers;
                if (assignedFeatureDevelopers !== null) {
                    const keys = getKeysForList(assignedFeatureDevelopers);
                    assignedDevList = assignedFeatureDevelopers?.map((dev, index) => {
                        const devTypeElement = (dev.developerType[0] !== "") ? `(${dev.developerType})` : "";
                        return (
                            <li key={keys[index]}>{dev.username} {devTypeElement}</li>
                        );
                    });
                }
                tableRows = (<FeatureTableRows feature={feature} featureIndex={index} handleStatusChange={handleStatusChange}></FeatureTableRows>)


            }



            return (
                <details key={keysForFeatures[index]} style={{ border: `medium solid ${appThemeContext.tertiaryContentColor} ` }}>
                    <summary> {"Feature overview : "}</summary>
                    <Background cssClassName="feature-overview" >
                        <h3> {`${feature.title} ${feature.type ? `(${feature.type})` : ""}`} </h3>
                        <textarea defaultValue={feature.description} />


                        <details>
                            <summary>{"Task-schedule : "}</summary>
                            <table>

                                <thead>
                                    <tr>
                                        <th scope="col">{"Pending tasks :"}</th>
                                        <th scope="col">{"Active tasks :"}</th>
                                        <th scope="col">{"Completed tasks :"}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableRows}
                                </tbody>
                            </table>
                        </details>
                        <details>
                            <summary>{"Assigned developers :"}</summary>
                            <ul>
                                {assignedDevList}
                            </ul>


                        </details>
                    </Background>
                </details>
            );
        }
        );
    }
}

/**
 * Takes in a list and gives back a React key-array matching the length of that list
 * 
 * @param list - list of elements needing keys
 * @returns Generated keys for all list members
 */
export function getKeysForList(list: Array<T>) {
    const numberOfMembersInlist = list.length;

    let keysNeededForList: Key[] = new Array<Key>(numberOfMembersInlist);

    for (let i = 0; i < numberOfMembersInlist; i++) {

        keysNeededForList[i] = window.crypto.randomUUID();
    }
    return keysNeededForList;
}

export type AddTaskElementProps = {

    features: Feature[] | null,

    handleAddTask: (type: string, description: string, timeconstraints: TimeConstraints, assignedDevelopers: Developer[] | null, selectedFeatureIndex: number) => void


}


