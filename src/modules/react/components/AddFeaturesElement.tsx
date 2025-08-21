import { useContext, ReactNode, useState, Key, ChangeEvent } from "react";
import { TimeConstraints } from "../../Timeconstraints";
import { Developer } from "../../User";
import { themeContext } from "../context/ThemeContext";
import { Button } from "./Button";
import { FieldSetOptions, Form } from "./Form";
import { Input } from "./Input";
import { AddFeaturesElementProps } from "./ProjectsTab";

export function AddFeaturesElement({ onSubmitFeature, projectDevTeam }: AddFeaturesElementProps) {

    const appThemeContext = useContext(themeContext);

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
        );
    }) : projectDevTeam?.map((dev, index) => {

        return (
            <option key={keys[index]} value={index}> {`${dev.username} ${` (${dev.developerType}) `}`}</option>
        );
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
            alert("Sorry, not all the required input was confirmed, please try again! You need to at least provide : Title, description, feature type as well as start date and end date");
        }


    }

    function handleDevSelect(e: ChangeEvent<HTMLSelectElement>) {

        e.stopPropagation();
        setAddFeatureState((prevState) => {
            const devArray = new Array(e.target.selectedOptions.length);
            for (let i = 0; i < e.target.selectedOptions.length; i++) {
                devArray[i] = e.target.selectedOptions.item(i)?.value;

            }
            return ({
                ...prevState,
                developersAssigned: devArray
            });
        });

    }



    return (
        <details>
            <summary>{"Add features : "}</summary>
            <Form style={{ border: `medium solid ${appThemeContext.tertiaryContentColor} ` }} cssClassName="add-feature-form" fieldSetOptions={addFeatureFieldSetOptions}>

                <Input inputType="text" cssClassName="feature-title-input" labelName="Title :" name="featureTitleInput" onEvent={handleChange} onInput={handleInput} inputState={addFeatureState.featureTitleInput}>
                </Input>
                <Input inputType="text" cssClassName="feature-description-input" labelName="Description :" name="featureDescriptionInput" onEvent={handleChange} onInput={handleInput} inputState={addFeatureState.featureDescriptionInput}>
                </Input>
                <Input inputType="text" cssClassName="feature-type-input" labelName="Feature-type :" name="featureTypeInput" onEvent={handleChange} onInput={handleInput} inputState={addFeatureState.featureTypeInput}>
                </Input>


            </Form>
            <Form style={{ border: `medium solid ${appThemeContext.tertiaryContentColor} ` }} fieldSetOptions={timeConstraintsFieldSetOptions} cssClassName="time-constraints-add-form">
                <Input onEvent={handleChange} onInput={handleInput} inputState={addFeatureState.featureStartTime} inputType="datetime-local" labelName="Start time :" name="featureStartTime" cssClassName="project-start-time-input" />
                <Input onEvent={handleChange} onInput={handleInput} inputState={addFeatureState.featureEndTime} inputType="datetime-local" labelName="End time :" name="featureEndTime" cssClassName="project-end-time-input" />

            </Form>

            <Form cssClassName="developer-assignment-form" fieldSetOptions={devAssignFieldSetOptions}>




                <select value={addFeatureState.developersAssigned} onChange={(e) => handleDevSelect(e)} multiple={true} id="devs">
                    {devOptions}
                </select>




            </Form>

            <Button onClick={(e) => handleSubmitFeature(e)} isDisabled={false} cssClassName="add-feature-button"> {"Submit feature : "}</Button>
        </details>
    );
}
