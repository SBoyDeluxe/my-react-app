import { useState, ReactNode, ChangeEvent, FormEvent } from "react";
import { TimeConstraints } from "../../Timeconstraints";
import { Button } from "./Button";
import { FieldSetOptions, Form } from "./Form";
import { Input } from "./Input";
import { AddTaskElementProps, getKeysForList } from "./ProjectsTab";

export function AddTaskElement({ handleAddTask, features }: AddTaskElementProps) {
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

            return <option value={index} key={featureKeys[index]}> {`${feature.title}`}</option>;
        });

        let selectedFeature = (addTaskState.selectedFeatureIndex !== -1) ? features[addTaskState.selectedFeatureIndex] : null;
        let devOptions: ReactNode = (<></>);
        if (selectedFeature !== null && selectedFeature.assignedDevelopers !== null) {
            const keys = getKeysForList(selectedFeature.assignedDevelopers);
            devOptions = selectedFeature.assignedDevelopers.map((developer, index) => {
                const devTypeElement = (developer.developerType[0].trim() !== "") ? `(${developer.developerType})` : "";
                return (<option key={keys[index]} value={index}>{`${developer.username} ${devTypeElement}`}</option>);

            });

        }

        function handleSelectFeature(e: ChangeEvent<HTMLSelectElement>) {

            e.stopPropagation();

            setAddTaskState((prevState) => {

                return ({
                    ...prevState,
                    selectedFeatureIndex: parseInt(e.target.value)
                });
            });


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

            if (datesAreValid) {
                // We can get the indices of the developers assigned to the task in the state object and
                //  <features.assignedDevelopers>-property and match these values to get the wanted devs for the task
                //get selected feature 
                const selectedFeatureIndex = addTaskState.selectedFeatureIndex;
                const taskDevs = addTaskState.developersAssigned.map((devIndex) => features![selectedFeatureIndex].assignedDevelopers![devIndex]);

                const timeconstraints = new TimeConstraints(startDate, endDate);

                handleAddTask(addTaskState.taskTypeInput, addTaskState.taskDescriptionInput, timeconstraints, taskDevs, selectedFeatureIndex);



            }
            else {

                alert("All dates were not valid, please observe that your planned task can´t start before today, your end time for the task can not be a past date and your start date must come before your end date");
            }
        }

        function handleChange(e: ChangeEvent<HTMLInputElement>): void {
            e.stopPropagation();

            setAddTaskState((prevState) => {


                return ({
                    ...prevState,
                    [e.target.name]: e.target.value
                });

            });

        }

        function handleInput(e: FormEvent<HTMLInputElement>): void {

            setAddTaskState((prevState) => {


                return ({
                    ...prevState,
                    [e.target.name]: e.target.value
                });

            });

            e.stopPropagation();
        }
        let allVariablesExist = (addTaskState.taskTypeInput.trim() !== "") && (addTaskState.taskDescriptionInput.trim() !== "") && (addTaskState.taskStartTime !== "") && (addTaskState.taskEndTime !== "");

        return (<>
            <details>
                <summary>{"Add task ;"}</summary>
                <select name="selectedFeature" value={addTaskState.selectedFeatureIndex} onChange={handleSelectFeature}>
                    {featureOptions}
                </select>

                <Form cssClassName="add-task-form">



                    <Input inputType="text" cssClassName="task-description-input" labelName="Description :" name="taskDescriptionInput" onEvent={handleChange} onInput={handleInput} inputState={addTaskState.taskDescriptionInput}>
                    </Input>
                    <Input inputType="text" cssClassName="task-type-input" labelName="Task-type :" name="taskTypeInput" onEvent={handleChange} onInput={handleInput} inputState={addTaskState.taskTypeInput}>
                    </Input>


                </Form>
                <Form cssClassName="time-constraints-add-form" fieldSetOptions={timeConstraintsFieldSetOptions}>
                    <Input onEvent={handleChange} onInput={handleInput} inputState={addTaskState.taskStartTime} inputType="datetime-local" labelName="Start time :" name="taskStartTime" cssClassName="task-start-time-input" />
                    <Input onEvent={handleChange} onInput={handleInput} inputState={addTaskState.taskEndTime} inputType="datetime-local" labelName="End time :" name="taskEndTime" cssClassName="task-end-time-input" />

                </Form>
                <Form cssClassName="developer-assignment-form" fieldSetOptions={devAssignFieldSetOptions}>




                    <select name="developersAssigned" value={addTaskState.developersAssigned} onChange={(e) => handleDevSelect(e)} multiple={true} id="devs">
                        {devOptions}
                    </select>




                </Form>

                <Button cssClassName="add-task-button" isDisabled={!allVariablesExist} onClick={handleClick}>{"Add task"}</Button>
            </details>
        </>);
    }
    else {
        return (<></>);
    }
}
