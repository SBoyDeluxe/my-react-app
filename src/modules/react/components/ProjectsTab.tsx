import { ReactNode, useContext, useEffect, useState, useSyncExternalStore, ChangeEvent, Key, useReducer, FormEvent, Fragment } from "react";
import { Developer } from "../../User";
import { ProjectStore } from "../store/UserStore";
import { Project } from "../../project";
import { useLoadingStore } from "./LoadingStore";
import { Background } from "./background";
import { themeContext } from "../context/ThemeContext";
import { ProgressBar } from "./ProgressBar";
import { TimeConstraints } from "../../Timeconstraints";
import { FieldSetOptions, Form } from "./Form";
import { Input } from "./Input";
import { Button } from "./Button";
import { FeatureReducer } from "./reducers/FeatureReducer";
import { Feature } from "../../feature";
import { Task } from "../../Task";
import { get } from "node:http";



export type ProjectsTabProp = {
    /**
     * 
     */
    projectList: string[],

}

export function ProjectsTab() {
    let keysNeededForList: Key[];
    const projectStore = useSyncExternalStore(ProjectStore.subscribe, ProjectStore.getSnapshotProjects);
    let loadingStore = useLoadingStore();
    const appThemeContext = useContext(themeContext);
    useEffect(() => ProjectStore.getProjects, []);
    let activeProjects: Project[] | null = projectStore;

    const [state, dispatcher] = useReducer(FeatureReducer, null);


    function getTimeFraction(timeConstraints: TimeConstraints) {

        const startDate = Date.parse(timeConstraints._startdate);
        const endDate = Date.parse(timeConstraints._enddate);

        const currentDate = Date.now();

        const totalTime = endDate - startDate;

        const timePassed = currentDate - startDate;

        return timePassed / totalTime * 100;


    }

    if (activeProjects !== null) {

        keysNeededForList = getKeysForList(activeProjects);



    }

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
       
        const action = { type: "ADD_FEATURE", payload: { title: title, description: description, type: type, timeconstraints: timeconstraints, developmentTasks: null, assignedDevelopers: developersAssigned } }
        dispatcher(action);

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


                        return (
                            <Background key={keysNeededForList[index]} cssClassName="project-details-container" backgroundColor={appThemeContext.tertiaryContentColor}>

                                <ProgressBar barColor={appThemeContext.tertiaryContrastColor} progress={(getTimeFraction(project.timeconstraints))} />
                                <details className="project-details-element"  >
                                    <summary><b>{`${project.title} : ${project.timeconstraints._startdate} -> ${project.timeconstraints._enddate}`} </b></summary>





                                    <details className="add-features-details-element" >
                                        <summary>{"Add feature"}</summary>
                                        <AddFeaturesElement onSubmitFeature={handleSubmitFeature} projectDevTeam={project.developerTeam} projectTimeConstraints={project.timeconstraints}>

                                        </AddFeaturesElement>

                                    </details>

                                    <details>
                                        <summary> {"Feature overview : "}</summary>

                                        <FeatureOverview handleStatusChange={dispatcher} features={state} />
                                        <details>
                                            <summary>{"Add task ;"}</summary>
                                            <AddTaskElement handleAddTask={(type, description, timeconstraints, assignDevelopers, selectedFeatureIndex)=>{
                                                //Make action object with complete payload and type === "ADD_DEVELOPMENT_TASK"
                                                const newTask = new Task(type, description, timeconstraints, assignDevelopers, null, "Pending")
                                                const action = {type : "ADD_DEVELOPMENT_TASKS", 
                                                                payload : {
                                                                            featureIndex : selectedFeatureIndex,
                                                                            timeconstraints:timeconstraints,
                                                                            devTask : newTask



                                                                                                    }
                                            };

                                            dispatcher(action);

                                            

                                            }} features={state}></AddTaskElement>
                                        </details>

                                    </details>


                                </details>

                            </Background>
                        )
                    })}
                </>
            )

        }
    </>)

}
type AddFeaturesElementProps = {
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

    handleStatusChange : ((action : any)=>void),

}

function FeatureOverview({handleStatusChange ,features }: FeatureOverviewProps): ReactNode {
       


    if (features === null) {

        return <></>
    }
    else {
        let tableRows:ReactNode[] = [];
         let assignedDevList: ReactNode = (<></>);
        const appThemeContext = useContext(themeContext);
         
        const keysForFeatures = getKeysForList(features);
        return features.map((feature, index) => {

            if( feature.developmentTasks !== null){   
            const activeTasks = feature.getActiveDevelopmentTasks();
            const pendingTasks = feature.getPendingDevelopmentTasks();
            const completedTasks = feature.developmentTasks!.filter((devTask)=> (devTask.currentTaskStatus === "Completed"));
            const numberOfPendingTasks = pendingTasks.length;
            const numberOfActiveTasks = activeTasks.length;
            const numberOfCompletedTasks = completedTasks.length;


            const progress = feature.getProgress();
           // We need to generate a number of rows accomodating the largest of the active, pending or complete tasks : this array is sorted from largest to smallest
           // <=> We need as many rows as the first element of the array
            let amountOfDifferentTasks = [numberOfActiveTasks, numberOfCompletedTasks, numberOfPendingTasks].sort((numberA, numberB) => {
                return numberB - numberA;
            });
           
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
            //We will need one key for each row, since this is a mapping call
            const keysForTableRows = getKeysForList( new Array(amountOfDifferentTasks[0]));
            //We will also need one key per  task and type of task

            const activeTaskKeys = getKeysForList(activeTasks);
            const pendingTaskKeys = getKeysForList(pendingTasks);
            const completedTaskKeys = getKeysForList(new Array(numberOfCompletedTasks));
                //amountOfDifferentTasks[0] === amount of rows we need
                //We go down each row and try to add the completed, active and pending tasks in the order:
                //Pending (0)-> Active (1) -> Completed (2)

                let mappedTasks : ReactNode[][] = new Array(amountOfDifferentTasks[0]).fill(new Array(3));
                for(let i = 0 ; i < amountOfDifferentTasks[0] ; i++){
                        
                        for(let k = 0 ; k < 3 ; k++){

                                switch (k) {
                                    case 0:{
                                                                //We only try taskKeys after the check that i < ... .length <=> We can just check for i
                                        mappedTasks[i][k] = (i < pendingTasks.length) ? (<div style={{border : `medium inset ${appThemeContext.primaryBackgroundColor} `}} key={pendingTaskKeys[i]}><h5>{`${pendingTasks[i].timeconstraints.startdate} -> ${pendingTasks[i].timeconstraints.enddate}`}</h5>
                                                                                                <h5>{`${pendingTasks[i].type}`}</h5>

                                                                                                <textarea disabled = {false} defaultValue={pendingTasks[i].description}>
                                                                                                    
                                                                                                    </textarea>         
                                                                                                    <Button isDisabled={false} onClick={(e)=>{ e.preventDefault(); e.stopPropagation();
                                                                                                            //make action object
                                                                                                            
                                                                                                            const devTaskIndex = feature.developmentTasks?.findIndex((task)=> ((task.type === pendingTasks[i].type) && (task.description === pendingTasks[i].description)
                                                                                                             && (task.assignedDevelopers === pendingTasks[i].assignedDevelopers)));
                                                                                                            const action = {
                                                                                                                type :  "CHANGE_DEV_TASK_STATUS",
                                                                                                                payload : {
                                                                                                                        devTaskIndex:devTaskIndex,
                                                                                                                        featureIndex:index,
                                                                                                                        newStatus:"Active"
                                                                                                                }
                                                                                                                
                                                                                                                    };
                                                                                                                    
                                                                                                                    handleStatusChange(action);
                                                                                                            

                                                                                                    }} cssClassName="task-to-active-task-button">{"Set task as active: "}</Button>
                                                                                                                                                                                                </div>) 
                                                                                    :       (<></>) ;
                                                                                                                                                                                                
                                    }
                                        
                                        break;
                                    case 1: {
                                                                //We only try taskKeys after the check that i < ... .length <=> We can just check for i
                                        mappedTasks[i][k] = (i < activeTasks.length) ? (<div style={{border : `medium inset ${appThemeContext.primaryBackgroundColor} `}} key={activeTaskKeys[i]}><h5>{`${activeTasks[i].timeconstraints.startdate} -> ${activeTasks[i].timeconstraints.enddate}`}</h5>
                                                                                                <h5>{`${activeTasks[i].type}`}</h5>

                                                                                                <textarea disabled = {false} defaultValue={activeTasks[i].description}>
                                                                                                    
                                                                                                    </textarea>
                                                                                                                       <Button isDisabled={false} onClick={(e)=>{ e.preventDefault(); e.stopPropagation();
                                                                                                            //make action object
                                                                                                            
                                                                                                            const devTaskIndex = feature.developmentTasks?.findIndex((task)=> ((task.type === activeTasks[i].type) && (task.description === activeTasks[i].description)
                                                                                                             && (task.assignedDevelopers === activeTasks[i].assignedDevelopers)));
                                                                                                             FeatureReducer
                                                                                                            const action = {
                                                                                                                
                                                                                                                type :  "CHANGE_DEV_TASK_STATUS",
                                                                                                                payload : {
                                                                                                                        devTaskIndex:devTaskIndex,
                                                                                                                        featureIndex:index,
                                                                                                                        newStatus:"Complete"
                                                                                                                }
                                                                                                                
                                                                                                                    };

                                                                                                                    activeTasks[i].completeTask();
                                                                                                                    
                                                                                                                    handleStatusChange(action);
                                                                                                            

                                                                                                    }} cssClassName="task-to-complete-task-button">{"Set task as complete : "}</Button>   
                                                                                                      <Button isDisabled={false} onClick={(e)=>{ e.preventDefault(); e.stopPropagation();
                                                                                                            //make action object
                                                                                                            
                                                                                                            const devTaskIndex = feature.developmentTasks?.findIndex((task)=> ((task.type === activeTasks[i].type) && (task.description === activeTasks[i].description)
                                                                                                             && (task.assignedDevelopers === activeTasks[i].assignedDevelopers)));
                                                                                                            const action = {
                                                                                                                type :  "CHANGE_DEV_TASK_STATUS",
                                                                                                                payload : {
                                                                                                                        devTaskIndex:devTaskIndex,
                                                                                                                        featureIndex:index,
                                                                                                                        newStatus:"Pending"
                                                                                                                }
                                                                                                                
                                                                                                                    };
                                                                                                                    
                                                                                                                    handleStatusChange(action);
                                                                                                            

                                                                                                    }} cssClassName="task-to-pending-task-button">{"Set task as pending : "}</Button>                                                                              </div>) 
                                                                                    :       (<></>) ;
                                                                                                                                                                                                
                                    }
                                        
                                        break;
                                    case 2:{
                                                                //We only try taskKeys after the check that i < ... .length <=> We can just check for i
                                        mappedTasks[i][k] = (i < completedTasks.length) ? (<div style={{border : `medium inset ${appThemeContext.primaryBackgroundColor} `}} key={completedTaskKeys[i]}><h5>{`${completedTasks[i].timeconstraints.startdate} -> ${completedTasks[i].timeconstraints.enddate} \n \t Completed at : ${completedTasks[i].timeconstraints.completiondate}`}</h5>
                                                                                                <h5>{`${completedTasks[i].type}`}</h5>

                                                                                                <textarea defaultValue ={completedTasks[i].description} disabled = {false}>
                                                                                                    
                                                                                                    </textarea>
                                                                                                                                                                                                </div>) 
                                                                                    :       (<></>) ;
                                                                                                                                                                                                
                                    }
                                        
                                        break;
                                
                                    default:
                                        break;
                                }

                                //Once we have exited the switch-statement we have mapped all our tasks for one row

                        }
                     

                                                                                //-----!!PUT DEVELOPERS IN EACH TASK !!--------



                }
                                        //Once we finish the for loop we have mapped all rows of elements, we can safely put each element into any table row since they´re, at worst, are empty
                        tableRows = new Array(amountOfDifferentTasks[0]);
                        for(let i = 0 ; i < amountOfDifferentTasks[0] ; i ++){

                                tableRows[i] = (<Fragment key={keysForTableRows[i]}>
                                                        <tr>
                                                            <td>{mappedTasks[i][0]}</td>
                                                            <td>{mappedTasks[i][1]}</td>
                                                            <td>{mappedTasks[i][2]}</td>
                                                        </tr>

                                                </Fragment>)
                        }

            }

            

            return (

                <Background key={keysForFeatures[index]} cssClassName="feature-overview" >
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
function getKeysForList(list: Array<T>) {
    const numberOfMembersInlist = list.length;

    let keysNeededForList: Key[] = new Array<Key>(numberOfMembersInlist);

    for (let i = 0; i < numberOfMembersInlist; i++) {

        keysNeededForList[i] = window.crypto.randomUUID();
    }
    return keysNeededForList;
}

function AddFeaturesElement({ onSubmitFeature, projectDevTeam, projectTimeConstraints }: AddFeaturesElementProps) {

    const featureLegendText: ReactNode = (<><b><p>{"Add feature : "}</p></b></>);

    const [addFeatureState, setAddFeatureState] = useState({
        featureTitleInput: "",
        featureDescriptionInput: "",
        featureTypeInput: "",
        featureStartTime: "",
        featureEndTime: "",
        developersAssigned: [-1]
    });

    const addFeatureFieldSetOptions: FieldSetOptions = {
        children: featureLegendText
    };
    const timeConstraintLegendText: ReactNode = (<><b><p>{"Set time-constraints : "}</p></b></>);
    const timeConstraintsFieldSetOptions: FieldSetOptions = {
        children: timeConstraintLegendText
    };
    const devAssignLegendText: ReactNode = (<><b><p>{"Assign Developers : "}</p></b></>);
    const devAssignFieldSetOptions: FieldSetOptions = {
        children: devAssignLegendText
    };

    //generate keys for each list item

    let keys: Key[] = new Array(projectDevTeam?.length * 2);

    for (let i = 0; i < projectDevTeam?.length * 2; i++) {

        keys[i] = window.crypto.randomUUID();
    }

    let devOptions = (addFeatureState.featureTypeInput.trim() !== "") ? projectDevTeam?.sort((devA, devB) => {

        const featureTypeInput = addFeatureState.featureTypeInput;
        //If one of them includes the input <=> Then they both can contain it or just one of them
        if (devA.developerType.includes(featureTypeInput) || devB.developerType.includes(featureTypeInput)) {

            if (devA.developerType.includes(featureTypeInput) && devB.developerType.includes(featureTypeInput)) {
                //If both contain it, they´re rated equal
                return 0;


            }
            else if (devA.developerType.includes(featureTypeInput)) {
                //Negative value means that first element should come before the second one
                return -1;
            }
            else {

                return 1;
            }
        }
        else {
            //If neither includes it then they are rated equal
            return 0;
        }
    }
    ).map((dev, index) => {

        return (
            <option value={index} key={keys[index]}> {`${dev.username} ${!(dev.developerType.includes("")) ? ` (${dev.developerType}) ` : ""}`}</option>
        )
    }) : projectDevTeam?.map((dev, index) => {

        return (
            <option key={keys[index]} value={index}> {`${dev.username} ${` (${dev.developerType}) `}`}</option>
        )
    });



    function handleChange(e: ChangeEvent<HTMLInputElement>) {

        e.stopPropagation();

        setAddFeatureState((prevState) => {
            return ({
                ...prevState,
                [e.target.name]: e.target.value
            });
        });
    }

    function handleInput(e: React.FormEvent<HTMLInputElement>) {

        e.stopPropagation();

        setAddFeatureState((prevState) => {

            return ({

                ...prevState,
                [e.target.name]: e.target.value
            });
        });
    }

    function handleSubmitFeature(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        e.stopPropagation();


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

        // Must include: title, type, desc, timeConstraints, 
        const allVariablesExist = (addFeatureState.featureTitleInput.trim() !== "") && (addFeatureState.featureTypeInput.trim() !== "") && (addFeatureState.featureDescriptionInput.trim() !== "") && (addFeatureState.featureStartTime !== "") && (addFeatureState.featureEndTime !== "");
        if (allVariablesExist) {
            const startDate = new Date(addFeatureState.featureStartTime);
            const endDate = new Date(addFeatureState.featureEndTime);
            const todaysDate = new Date(Date.now());


            const datesAreValid = ((endDate.getTime() >= startDate.getTime()) && (endDate.getTime() >= todaysDate.getTime()));

            if (datesAreValid) {
                // Get actual developers from their indices 
                let assignedDevs: Developer[] | null = null;
                if (addFeatureState.developersAssigned[0] !== -1) {

                    assignedDevs = addFeatureState.developersAssigned.map((developerIndex) => projectDevTeam![developerIndex]!);
                }
                else {
                    assignedDevs = null;

                }



                const timeconstraints = new TimeConstraints(startDate, endDate);

                onSubmitFeature(addFeatureState.featureTitleInput, addFeatureState.featureDescriptionInput, addFeatureState.featureTypeInput, timeconstraints, assignedDevs);
                //Reset the fields on successful input
                setAddFeatureState({
                    featureTitleInput: "",
                    featureDescriptionInput: "",
                    featureTypeInput: "",
                    featureStartTime: "",
                    featureEndTime: "",
                    developersAssigned: [-1]
                });
            }
            else {
                alert("Sorry, those dates were not valid! Make sure start date is after end date, as well as end date being at least today");
            }

        }
        else {
            alert("Sorry, not all the required input was confirmed, please try again! You need to at least provide : Title, description, feature type as well as start date and end date")
        }


    }

    function handleDevSelect(e: ChangeEvent<HTMLSelectElement>) {

        e.stopPropagation();
        setAddFeatureState((prevState) => {
            const devArray = new Array(e.target.selectedOptions.length);
            for (let i = 0; i < e.target.selectedOptions.length; i++) {
                devArray[i] = e.target.selectedOptions.item(i)?.value

            }
            return ({
                ...prevState,
                developersAssigned: devArray
            });
        });

    }



    return (
        <>
            <Form cssClassName="add-feature-form" fieldSetOptions={addFeatureFieldSetOptions} >

                <Input inputType="text" cssClassName="feature-title-input" labelName="Title :" name="featureTitleInput" onEvent={handleChange} onInput={handleInput} inputState={addFeatureState.featureTitleInput} >
                </Input>
                <Input inputType="text" cssClassName="feature-description-input" labelName="Description :" name="featureDescriptionInput" onEvent={handleChange} onInput={handleInput} inputState={addFeatureState.featureDescriptionInput} >
                </Input>
                <Input inputType="text" cssClassName="feature-type-input" labelName="Feature-type :" name="featureTypeInput" onEvent={handleChange} onInput={handleInput} inputState={addFeatureState.featureTypeInput} >
                </Input>


            </Form>
            <Form fieldSetOptions={timeConstraintsFieldSetOptions} cssClassName="time-constraints-add-form" >
                <Input onEvent={handleChange} onInput={handleInput} inputState={addFeatureState.featureStartTime} inputType="datetime-local" labelName="Start time :" name="featureStartTime" cssClassName="project-start-time-input" />
                <Input onEvent={handleChange} onInput={handleInput} inputState={addFeatureState.featureEndTime} inputType="datetime-local" labelName="End time :" name="featureEndTime" cssClassName="project-end-time-input" />

            </Form>

            <Form cssClassName="developer-assignment-form" fieldSetOptions={devAssignFieldSetOptions} >




                <select value={addFeatureState.developersAssigned} onChange={(e) => handleDevSelect(e)} multiple={true} id="devs">
                    {devOptions}
                </select>




            </Form>

            <Button onClick={(e) => handleSubmitFeature(e)} isDisabled={false} cssClassName="add-feature-button"  > {"Submit feature : "}</Button>
        </>
    );
}
type AddTaskElementProps = {

    features: Feature[] | null,

    handleAddTask: (type: string, description: string, timeconstraints: TimeConstraints, assignedDevelopers: Developer[] | null, selectedFeatureIndex : number) => void


}

function AddTaskElement({ handleAddTask,features }: AddTaskElementProps) {
    //type: string, description: string, timeconstraints: TimeConstraints, assignedDevelopers: Developer[] | null, taskGoals: Task[] | null, currentTaskStatus: string | null): Task
    if (features !== null) {
        const [addTaskState, setAddTaskState] = useState({
            taskDescriptionInput: "",
            taskTypeInput: "",
            taskStartTime: "",
            taskEndTime: "",
            developersAssigned: [0],
            selectedFeatureIndex: 0
        });

        const timeConstraintLegendText: ReactNode = (<><b><p>{"Set time-constraints : "}</p></b></>);
        const timeConstraintsFieldSetOptions: FieldSetOptions = {
            children: timeConstraintLegendText
        };
        const devAssignLegendText: ReactNode = (<><b><p>{"Assign Developers to task: "}</p></b></>);
        const devAssignFieldSetOptions: FieldSetOptions = {
            children: devAssignLegendText
        };

        let featureKeys = getKeysForList(features);

        let featureOptions = features.map((feature, index) => {

            return <option value={index} key={featureKeys[index]}> {`${feature.title}`}</option>
        });

        let selectedFeature = (addTaskState.selectedFeatureIndex !== -1) ? features[addTaskState.selectedFeatureIndex] : null;
        let devOptions: ReactNode = (<></>);
        if (selectedFeature !== null && selectedFeature.assignedDevelopers !== null) {
            const keys = getKeysForList(selectedFeature.assignedDevelopers);
            devOptions = selectedFeature.assignedDevelopers.map((developer, index) => {
                const devTypeElement = (developer.developerType[0].trim() !== "") ? `(${developer.developerType})` : "";
                return (<option key={keys[index]} value={index}>{`${developer.username} ${devTypeElement}`}</option>)

            });

        }

        function handleSelectFeature(e: ChangeEvent<HTMLSelectElement>) {

            e.stopPropagation();

            setAddTaskState((prevState) => {

                return ({
                    ...prevState,
                    selectedFeatureIndex: parseInt(e.target.value)
                });
            })


        }

        function handleDevSelect(e: ChangeEvent<HTMLSelectElement>): void {

            let newDevArray = new Array(e.target.selectedOptions.length);

            for (let i = 0; i < newDevArray.length; i++) {

                newDevArray[i] = e.target.selectedOptions.item(i)?.value;
            }

            setAddTaskState((prevState) => {

                return ({

                    ...prevState,
                    developersAssigned: newDevArray
                });

            }

            );
        }

        function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

            e.preventDefault();
            e.stopPropagation();

            //Since button is not disabled <=> All variables exist
             const startDate = new Date(addTaskState.taskStartTime);
            const endDate = new Date(addTaskState.taskEndTime);
            const todaysDate = new Date(Date.now());

            const datesAreValid = ((endDate.getTime() >= startDate.getTime()) && (endDate.getTime() >= todaysDate.getTime()));

            if(datesAreValid){
            // We can get the indices of the developers assigned to the task in the state object and
            //  <features.assignedDevelopers>-property and match these values to get the wanted devs for the task

            //get selected feature 
           const selectedFeatureIndex = addTaskState.selectedFeatureIndex;
            const taskDevs = addTaskState.developersAssigned.map((devIndex) => features![selectedFeatureIndex].assignedDevelopers![devIndex]);

            const timeconstraints = new TimeConstraints(startDate, endDate);

            handleAddTask(addTaskState.taskTypeInput, addTaskState.taskDescriptionInput, timeconstraints, taskDevs, selectedFeatureIndex)



        }
        else{

            alert("All dates were not valid, please observe that your planned task can´t start before today, your end time for the task can not be a past date and your start date must come before your end date");
        }
        }

        function handleChange(e: ChangeEvent<HTMLInputElement>): void {
            e.stopPropagation();

            setAddTaskState((prevState)=>{

                
                return(  {
                        ...prevState,
                        [e.target.name] : e.target.value
                    });
                
            });

        }

        function handleInput(e: FormEvent<HTMLInputElement>): void {

             setAddTaskState((prevState)=>{

                
                return(  {
                        ...prevState,
                        [e.target.name] : e.target.value
                    });
                
            });

            e.stopPropagation();
        }
        let allVariablesExist = (addTaskState.taskTypeInput.trim() !== "") && (addTaskState.taskDescriptionInput.trim() !== "") && (addTaskState.taskStartTime !== "") && (addTaskState.taskEndTime !== "");

        return (<>
            <select name="selectedFeature" value={addTaskState.selectedFeatureIndex} onChange={handleSelectFeature}>
                {featureOptions}
            </select>
            
            <Form cssClassName="add-task-form" >

                

                <Input inputType="text" cssClassName="task-description-input" labelName="Description :" name="taskDescriptionInput" onEvent={handleChange} onInput={handleInput} inputState={addTaskState.taskDescriptionInput}>
                </Input>
                <Input inputType="text" cssClassName="task-type-input" labelName="Task-type :" name="taskTypeInput" onEvent={handleChange} onInput={handleInput} inputState={addTaskState.taskTypeInput}>
                </Input>


            </Form>
            <Form cssClassName="time-constraints-add-form" fieldSetOptions={timeConstraintsFieldSetOptions}>
                <Input onEvent={handleChange} onInput={handleInput} inputState={addTaskState.taskStartTime} inputType="datetime-local" labelName="Start time :" name="taskStartTime" cssClassName="task-start-time-input" />
                <Input onEvent={handleChange} onInput={handleInput} inputState={addTaskState.taskEndTime} inputType="datetime-local" labelName="End time :" name="taskEndTime" cssClassName="task-end-time-input" />

            </Form>
            <Form cssClassName="developer-assignment-form" fieldSetOptions={devAssignFieldSetOptions} >




                <select name="developersAssigned" value={addTaskState.developersAssigned} onChange={(e) => handleDevSelect(e)} multiple={true} id="devs">
                    {devOptions}
                </select>




            </Form>

            <Button cssClassName="add-task-button" isDisabled={!allVariablesExist} onClick={handleClick}>{"Add task"}</Button>
        </>)
    }
    else {
        return (<></>);
    }
}

