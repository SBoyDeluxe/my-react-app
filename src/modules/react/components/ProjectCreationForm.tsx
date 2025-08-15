
import { State } from "./App";
import { Background } from "./background";
import { themeContext } from "../context/ThemeContext";
import { Form } from "./Form";
import { ToggleButton } from "./ToggleButton";
import { TogglePair } from "./TogglePair";
import { Input } from "./Input";
import { Button } from "./Button";
import {Dispatch,ReactNode, SetStateAction } from "react";
import React from "react";



type ProjectCreationFormProp = {

    setProjectTitleFormState: React.Dispatch<React.SetStateAction<{
        title: string;
        description: string;
    }>>,
    formState: {
        title: string;
        description: string;
    },
    setTimeDateState: React.Dispatch<React.SetStateAction<{
        startDate: string;
        endDate: string;
    }>>,
    timeDateState: {
        startDate: string;
        endDate: string;
    },
    setParticipantFormState: React.Dispatch<React.SetStateAction<{
        managers: string;
        devs: string;
        clients: string;
    }>>,
    participantFormState: {
        managers: string;
        devs: string;
        clients: string;
    },
    toggleState: State<boolean>,
    login: (username: string, password: string) => void,
    signUp: (username: string, password: string) => void,
}

 type TitleFormProps = {
  projectTitleFormState: {
        projectTitle: string,
        projectDescription:string,
    },
    setProjectTitleFormState :  (React.Dispatch<React.SetStateAction<{
    projectTitle: string;
    projectDescription: string;
}>>)

}

const titleFormFieldSetText = (<p> Title/Description : </p>);
function TitleForm({projectTitleFormState, setProjectTitleFormState }:TitleFormProps) : ReactNode {

    function handleChange(e:React.BaseSyntheticEvent<Event, EventTarget & HTMLInputElement, EventTarget>){
        
        setProjectTitleFormState((value)=>({...value, [e.target.name] : e.target.value}));
    }


    return(<Form cssClassName={"project-title-description-form" } fieldSetOptions={ {children:titleFormFieldSetText}}  >
            <Input onEvent={handleChange}  inputState={projectTitleFormState.projectTitle} inputType="text" labelName="Title :" name="projectTitle" cssClassName="project-title-input" />
           <Input onEvent={handleChange} inputState={projectTitleFormState.projectDescription} inputType="text" labelName="Project description :" name="projectDescription" cssClassName="project-description-input" />
    </Form>)
  


}
type DateFormProps = {
  projectDateFormState: {
        startDate: string,
        endDate: string,
    },
    setProjectDateFormState :  (React.Dispatch<React.SetStateAction<{
    startDate: string;
    endDate: string;
}>>)

}
const dateFormFieldSetText = (<p> {"Start-date -> End-date"} : </p>);
function DateForm({projectDateFormState, setProjectDateFormState }:DateFormProps) : ReactNode {

    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
        
        setProjectDateFormState((value)=>({...value, [event.target.name] : event.target.value}));
    }


    return(<Form cssClassName={"project-title-description-form" } fieldSetOptions={ {children:dateFormFieldSetText}}  >
            <Input onEvent={handleChange}  inputState={projectDateFormState.startDate} inputType="text" labelName="Title :" name="startDate" cssClassName="project-start-date-input" />
           <Input onEvent={handleChange} inputState={projectDateFormState.endDate} inputType="text" labelName="Project description :" name="endDate" cssClassName="project-end-date-input" />
    </Form>);
  


}
type ParticipantFormProps = {
  projectParticipantFormState: {
     managers: string,
            developers: string,
            client: string
     
    },
    setProjectParticipantFormState :  (React.Dispatch<React.SetStateAction<{
             managers: string;
            developers: string;
            client: string;
}>>)

}
const ParticipantFormFieldSetText = (<p> {"Add participants : "} : </p>);
function ParticipantForm({projectParticipantFormState, setProjectParticipantFormState }:ParticipantFormProps) : ReactNode {

    function handleChange(e:React.BaseSyntheticEvent<Event, EventTarget & HTMLInputElement, EventTarget>){
        
        setProjectParticipantFormState((value)=>({...value, [e.target.name] : e.target.value}));
    }


    return(<Form cssClassName={"project-title-description-form" } fieldSetOptions={ {children:ParticipantFormFieldSetText}}  >
            <Input onEvent={handleChange}  inputState={projectParticipantFormState.managers} inputType="text" labelName="Title :" name="managers" cssClassName="project-managers-input" />
           <Input onEvent={handleChange} inputState={projectParticipantFormState.developers} inputType="text" labelName="Project description :" name="developers" cssClassName="project-developers-input" />
           <Input onEvent={handleChange} inputState={projectParticipantFormState.client} inputType="text" labelName="Project description :" name="client" cssClassName="project-clients-input" />
    </Form>);
  


}


export function ProjectCreationForm(): React.ReactNode {

    const appThemeContext = React.useContext(themeContext);

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




    function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

        
        event.preventDefault();
        event.stopPropagation();

        let requiredFieldsAreNotEmpty = (projectTitleFormState.projectTitle.trim() !== "" && projectTitleFormState.projectDescription.trim() !== "" && projectTimeDateFormState.startDate.trim() !== "" && projectTimeDateFormState.endDate.trim() !== ""
            && projectParticipantFormState.managers.trim() !== "" && projectParticipantFormState.developers.trim() !== "");
        if (requiredFieldsAreNotEmpty) {
            
        }
        else {
            alert("One or more of the required textfields can not be empty, please try again!");
        }
    }

    
   
    return (<>
        <Background cssClassName="participant-form-container" backgroundColor={appThemeContext.secondaryBackgroundColor}>
           <TitleForm projectTitleFormState={projectTitleFormState} setProjectTitleFormState={setProjectTitleFormState}></TitleForm>
           <DateForm projectDateFormState={projectTimeDateFormState} setProjectDateFormState={setProjectTimeDateFormState}></DateForm>
           <ParticipantForm projectParticipantFormState={projectParticipantFormState} setProjectParticipantFormState={setProjectParticipantFormState}></ParticipantForm>
        </Background>
        </>
    )
}