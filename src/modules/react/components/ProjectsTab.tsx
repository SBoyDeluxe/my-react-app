import { act, ReactNode, useContext, useEffect, useState, useSyncExternalStore, ChangeEvent, InputEvent, Key } from "react";
import { Developer, User } from "../../User";
import { firebaseClientContext, ProjectStore, UserStore } from "../store/UserStore";
import { Project } from "../../project";
import { LoadingStore, useLoadingStore } from "./LoadingStore";
import { Background } from "./background";
import { themeContext } from "../context/ThemeContext";
import { ProgressBar } from "./ProgressBar";
import { TimeConstraints } from "../../Timeconstraints";
import { FieldSetOptions, Form } from "./Form";
import { Input } from "./Input";
import { Button } from "./Button";



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


    function getTimeFraction(timeConstraints: TimeConstraints) {

        const startDate = Date.parse(timeConstraints._startdate);
        const endDate = Date.parse(timeConstraints._enddate);

        const currentDate = Date.now();

        const totalTime = endDate - startDate;

        const timePassed = currentDate - startDate;

        return timePassed / totalTime * 100;


    }

    if (activeProjects !== null) {

        const numberOfActiveProjects = activeProjects.length;

        keysNeededForList = new Array<Key>(numberOfActiveProjects);

        for (let i = 0; i < numberOfActiveProjects; i++) {

            keysNeededForList[i] = window.crypto.randomUUID();
        }



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

                                    <details>
                                        <summary> {"Features : "} </summary>

                                        <AddFeaturesElement projectDevTeam={project.developerTeam} projectTimeConstraints={project.timeconstraints}>

                                        </AddFeaturesElement>


                                    </details>
                                    <details>
                                        <summary> {"Participants :"} </summary>
                                    </details>
                                    <details>
                                        <summary> </summary>
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





}

function AddFeaturesElement({ projectDevTeam, projectTimeConstraints }: AddFeaturesElementProps) {

    const featureLegendText: ReactNode = (<><b><p>{"Add feature : "}</p></b></>);

    const [addFeatureState, setAddFeatureState] = useState({
        featureTitleInput: "",
        featureDescriptionInput: "",
        featureTypeInput: "",
        featureStartTime: "",
        featureEndTime: "",
        developerInput: "",
        developersAssigned : [-1]
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

    let keys : Key[] = new Array(projectDevTeam?.length);

    for(let i = 0 ; i < projectDevTeam?.length ; i++){

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
            else if (devA.developerType.includes(featureTypeInput)){
                //Negative value means that first element should come before the second one
                return -1;
            }
            else{

                return 1;
            }
            }
            else{
                //If neither includes it then they are rated equal
                return 0;
            }
    }
    ).map((dev, index) => {

       return (<>
            <option value={index} key={keys[index]}> {`${dev.username} ${!(dev.developerType.includes("")) ? ` (${dev.developerType}) ` : ""}`}</option>
        </>)
    }) : projectDevTeam?.map((dev,index) => {

       return (<>
            <option key = {keys[index]}value={index}> {`${dev.username} ${ ` (${dev.developerType}) `}`}</option>
        </>)
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



    }

    function handleDevSelect(e: ChangeEvent<HTMLSelectElement>){

        e.stopPropagation();
        setAddFeatureState((prevState)=>{
           const devArray = new Array(e.target.selectedOptions.length);
           for(let i = 0 ; i < e.target.selectedOptions.length ; i++){
            devArray[i] = e.target.selectedOptions.item(i)?.value

           }
            return({
                ...prevState,
                developersAssigned : devArray
            });
        });
        
    }

    function handleOnAddUserTypeClick(arg0: { usernameInput: any; userTypeInput: any; }, setUserInput: any) {
        throw new Error("Function not implemented.");
    }

    function handleOnRemoveUserTypeClick(arg0: { usernameInput: any; userTypeInput: any; }, setUserInput: any) {
        throw new Error("Function not implemented.");
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
                <Input  onEvent={handleChange} onInput={handleInput} inputState={addFeatureState.featureStartTime} inputType="datetime-local" labelName="Start time :" name="featureStartTime" cssClassName="project-start-time-input" />
                <Input  onEvent={handleChange} onInput={handleInput} inputState={addFeatureState.featureEndTime} inputType="datetime-local" labelName="End time :" name="featureEndTime" cssClassName="project-end-time-input" />

            </Form>

            <Form cssClassName="developer-assignment-form" fieldSetOptions={devAssignFieldSetOptions} >

               
               
                          
                <select value={addFeatureState.developersAssigned} onChange={(e)=>handleDevSelect(e)} multiple={true} id="devs">
                {devOptions}
                </select>
                



            </Form>

            <Button onClick={handleSubmitFeature} isDisabled={false} cssClassName="add-feature-button"  > {"Submit feature : "}</Button>
        </>
    );
}

