import { ReactNode, useContext } from "react";
import { Form } from "./Form";
import { Input } from "./Input";
import { FieldSetOptions } from "./Form";
import { themeContext } from "../context/ThemeContext";
import { Button } from "./Button";
import { State } from "./App";
import React from "react";

export type CreateProjectTabProps = {

    inputState: {
        projectTitle: string;
        projectDescription: string;
        projectStartTime: string;
        projectEndTime: string;
        projectManagers: string;
        projectDevelopers: string;
        projectClients: string;

    }, setCreateProjectState: React.Dispatch<React.SetStateAction<{
        projectTitle: string;
        projectDescription: string;
        projectStartTime: string;
        projectEndTime: string;
        projectManagers: string;
        projectDevelopers: string;
        projectClients: string;
    }>>,
    createProject: (
        projectTitle: string,
        projectDescription: string,
        projectStartTime: string,
        projectEndTime: string,
        projectManagers: string,
        projectDevelopers: string,
        projectClients: string,

    ) => void
}

const createProjectText = (<p>{"Create Project"}</p>);
const fieldSetDateLegendText = (<p>{"Start-date -> End-date :"}</p>);
const participantsLegendText = (<p>{"Add participants :"}</p>);


/**
 * The contents of the create project tab
 * 
 */
export function CreateProjectTab({ createProject, inputState, setCreateProjectState }: CreateProjectTabProps): ReactNode {


     const appThemeContext = useContext(themeContext);
     const fieldSetOptions: FieldSetOptions = { children: createProjectText, };
     const dateFieldSetOptions: FieldSetOptions = { children: fieldSetDateLegendText, textColor: appThemeContext.secondaryContentColor };
        const [projectTitleFormState, setProjectTitleFormState] = React.useState({
            projectTitle: "",
            projectDescription: ""
        });
        const [projectTimeDateFormState, setProjectTimeDateFormState] = React.useState({
            startDate: "",
            endDate: ""
        });
        const [projectParticipantFormState, setProjectParticipantFormState] = React.useState({
            managers: "",
            developers: "",
            client: ""
        });


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation();
        if(e.target.value){
        const nameOfChangingAttribute = e.target.name;
        setCreateProjectState(() => {
            return {
                ...inputState,
                [nameOfChangingAttribute]: e.target.value

            }
        });}



    };
    function handleInput(event: React.FormEvent<HTMLInputElement>) {
        if(event.target.value){
        event.stopPropagation();
        const nameOfChangingAttribute = event.target.name;
        setCreateProjectState((prev) => {
            return {
                ...prev,
                [nameOfChangingAttribute]: event.target.value

            }
        });
}


    }

    function handleClick(mouseEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        //Check so that all fields are filled
        mouseEvent.preventDefault();
        if (inputState.projectTitle && inputState.projectDescription && inputState.projectStartTime && inputState.projectEndTime && inputState.projectManagers && inputState.projectDevelopers && inputState.projectClients) {
            createProject(inputState.projectTitle, inputState.projectDescription, inputState.projectStartTime, inputState.projectEndTime, inputState.projectManagers, inputState.projectDevelopers, inputState.projectClients);
        }
    }




    return (
        
           <Form cssClassName="create-project-form" fieldSetOptions={fieldSetOptions} style={{
            backgroundColor: appThemeContext.primaryContentColor,
            border: `solid thin ${appThemeContext.secondaryContrastColor}`
             }}>
            <Input onEvent={(e)=>setProjectTitleFormState((prev)=>{
                    return ({...prev,
                        [e.target.name] : e.target.value
                    });
            })}  inputState={projectTitleFormState.projectTitle} inputType="text" labelName="Title :" name="projectTitle" cssClassName="project-title-input" />
            <Input onEvent={handleChange} onInput={handleInput} inputState={inputState.projectDescription} inputType="text" labelName="Project description :" name="projectDescription" cssClassName="project-description-input" />
            <Input onEvent={handleChange} onInput={handleInput} inputState={inputState.projectStartTime} inputType="date" labelName="Start time :" name="projectStartTime" cssClassName="project-start-time-input" />
            <Input onEvent={handleChange} onInput={handleInput} inputState={inputState.projectEndTime} inputType="date" labelName="End time :" name="projectEndTime" cssClassName="project-end-time-input" />
            <p>{"Please enter any participants in the following format : \n Managers : <username1>:<type1>,<type2>,... ; <username2> <type1>,<type2>,... \n Developers : <username1>:<type1>,<type2>,... ; <username2> <type1>,<type2>,... \n Clients : <username1>, <username2>.... "}</p>
            <Input onEvent={handleChange} onInput={handleInput} inputState={inputState.projectManagers} inputType="text" labelName="Add managers :" name="projectManagers" cssClassName="project-managers-input" />
            <Input onEvent={handleChange} onInput={handleInput} inputState={inputState.projectDevelopers} inputType="text" labelName="Add developers :" name="projectDevelopers" cssClassName="project-developers-input" />
            <Input onEvent={handleChange} onInput={handleInput} inputState={inputState.projectClients} inputType="text" labelName="Add clients :" name="projectClients" cssClassName="project-clients-input" />
            <Button isDisabled={false} cssClassName="create-project-submit-button" children={createProjectText} onClick={handleClick}></Button>

           </Form>

    
    );

}

