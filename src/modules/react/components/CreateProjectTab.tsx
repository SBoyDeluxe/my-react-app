import { Fragment, ReactNode, useContext, useReducer } from "react";
import { Form } from "./Form";
import { Input } from "./Input";
import { FieldSetOptions } from "./Form";
import { themeContext } from "../context/ThemeContext";
import { Button } from "./Button";
import { State } from "./App";
import React from "react";
import { Client, Manager } from "../../User";
import { Background } from "./background";
import { ClientInputData, ParticipantInputData, useParticipantReducer } from "./reducers/ParticipantInputReducer";

export type CreateProjectTabProps = {

    createProjectState: {
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


/**
 * The contents of the create project tab
 * 
 */
export function CreateProjectTab({ createProject }: CreateProjectTabProps): ReactNode {


    const createProjectText = (<p>{"Create Project"}</p>);
    const fieldSetDateLegendText = (<p>{"Start-date -> End-date :"}</p>);
    const participantsLegendText = (<p>{"Add participants :"}</p>);
    const appThemeContext = useContext(themeContext);
    const fieldSetOptions: FieldSetOptions = { children: createProjectText, };
    const dateFieldSetOptions: FieldSetOptions = { children: fieldSetDateLegendText, textColor: appThemeContext.secondaryContentColor };
    // const [projectTitleFormState, setProjectTitleFormState] = React.useState({
    //     projectTitle: "",
    //     projectDescription: ""
    // });
    // const [projectTimeDateFormState, setProjectTimeDateFormState] = React.useState({
    //     startDate: "",
    //     endDate: ""
    // });
    // const [projectParticipantFormState, setProjectParticipantFormState] = React.useState({
    //     managers: "",
    //     developers: "",
    //     client: ""
    // });

 const [participantState, participantDispatch] = useParticipantReducer();

    const [createProjectState, setCreateProjectState] = React.useState(() => {


        return ({
            projectTitle: "",
            projectDescription: "",
            projectStartTime: "",
            projectEndTime: "",
        })
    });




    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation();
        if (e.target.value) {
            const nameOfChangingAttribute = e.target.name;
            setCreateProjectState(() => {
                return {
                    ...createProjectState,
                    [nameOfChangingAttribute]: e.target.value

                }
            });
        }



    };
    function handleInput(event: React.FormEvent<HTMLInputElement>) {
        if (event.target.value) {
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

        console.log(createProjectState);
        if (createProjectState.projectTitle && createProjectState.projectDescription && createProjectState.projectStartTime && createProjectState.projectEndTime && createProjectState.projectManagers && createProjectState.projectDevelopers) {
            createProject(createProjectState.projectTitle, createProjectState.projectDescription, createProjectState.projectStartTime, createProjectState.projectEndTime, createProjectState.projectManagers, createProjectState.projectDevelopers, createProjectState.projectClients);
        }
    }


{/* <p>{"Please enter any participants in the following format : \n Managers : <username1>:<type1>,<type2>,... ; <username2> <type1>,<type2>,... \n Developers : <username1>:<type1>,<type2>,... ; <username2> <type1>,<type2>,... \n Clients : <username1>, <username2>.... "}</p>
            <Input onEvent={handleChange} onInput={handleInput} inputState={createProjectState.projectManagers} inputType="text" labelName="Add managers :" name="projectManagers" cssClassName="project-managers-input" />
            <Input onEvent={handleChange} onInput={handleInput} inputState={createProjectState.projectDevelopers} inputType="text" labelName="Add developers :" name="projectDevelopers" cssClassName="project-developers-input" />
            <Input onEvent={handleChange} onInput={handleInput} inputState={createProjectState.projectClients} inputType="text" labelName="Add clients :" name="projectClients" cssClassName="project-clients-input" /> */}

    return (

        <Form cssClassName="create-project-form" fieldSetOptions={fieldSetOptions} style={{
            backgroundColor: appThemeContext.primaryContentColor,
            border: `solid thin ${appThemeContext.secondaryContrastColor}`
        }}>
            <Input onEvent={handleChange} onInput={handleInput} inputState={createProjectState.projectTitle} inputType="text" labelName="Title :" name="projectTitle" cssClassName="project-title-input" />
            <Input onEvent={handleChange} onInput={handleInput} inputState={createProjectState.projectDescription} inputType="text" labelName="Project description :" name="projectDescription" cssClassName="project-description-input" />
            <Input onEvent={handleChange} onInput={handleInput} inputState={createProjectState.projectStartTime} inputType="date" labelName="Start time :" name="projectStartTime" cssClassName="project-start-time-input" />
            <Input onEvent={handleChange} onInput={handleInput} inputState={createProjectState.projectEndTime} inputType="date" labelName="End time :" name="projectEndTime" cssClassName="project-end-time-input" />
            <ParticipantInput participantInputDataList={participantState.projectManagers}></ParticipantInput>
            <ParticipantInput participantInputDataList={participantState.projectDevelopers}></ParticipantInput>
            <ParticipantInput participantInputDataList={participantState.projectClients}></ParticipantInput>
            <Button isDisabled={false} cssClassName="create-project-submit-button" children={createProjectText} onClick={handleClick}></Button>

        </Form>


    );

}
type ParticipantInputProps = {

  
    /**
     * Called to show the participants already input by the user as a list 
     * 
     */
    participantInputDataList: (ParticipantInputData[] | ClientInputData[])
}
function ParticipantInput({ participantInputDataList }: ParticipantInputProps) {



   
  const  appThemeContext = useContext(themeContext);
    let handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { };
    let handleInput = (event: React.FormEvent<HTMLInputElement>) => { };

    let inputElement = (<></>);


    if (Object.values(participantInputDataList[0]).length > 1) {
        const [userInput, setUserInput] = React.useState({ usernameInput: "", userTypeInput: "" });

        handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {



            setUserInput((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }));
        };



        handleInput = (event: React.FormEvent<HTMLInputElement>) => {
            setUserInput((prev) => ({
                ...prev,
                [event.target.name]: event.target.value,
            }));

        };






        inputElement = (<>
    
            <Input onInput={handleInput} onEvent={handleChange} inputState={userInput.usernameInput} inputType="text" name="usernameInput" labelName="Enter username :" cssClassName="add-participant-username-input" />
            <Button children={(<p>{"Remove user with username from list"}</p>)} />
            <Input onEvent={handleChange} onInput={handleInput} inputState={userInput.userTypeInput} inputType="text" name="userTypeInput" labelName="Add user-type :" cssClassName="add-participant-usertype-input" />
            <Button children={(<p>{"+"}</p>)} />
            <Button children={(<p>{"-"}</p>)} />
        <Button children={<p>{"Submit user : "}</p>}></Button>  
        </>);
    }
    else {
        const [userInput, setUserInput] = React.useState({ usernameInput: "" });
        handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {



            setUserInput((prev) => ({
                usernameInput: e.target.value
            }));
        };



        handleInput = (event: React.FormEvent<HTMLInputElement>) => {
            setUserInput((prev) => ({
                usernameInput: event.target.value
            }));
        };
        inputElement = (<>
            <Input onInput={handleInput} onEvent={handleChange} inputState={userInput.usernameInput} inputType="text" name="usernameInput" labelName="Enter username :" cssClassName="add-client-username-input" />
        </>);
    }

let listEntries = participantInputDataList.map((participantInputData) => {

    if (Object.keys(participantInputData).length < 2) {
        if (participantInputData.username.trim() !== "") {
            //Means we have client input and should only show username
            return (
                <li>{`Username : ${participantInputData.username} `}</li>
            )
        }
    }
    else {
        if (participantInputData.username.trim() !== "") {
            return (
                <li>{`Username : ${participantInputData.username} | User-types : ${participantInputData.userTypes}`}</li>


            )
        }
    }
});

return (
    <Fragment>
        {( listEntries[0]!==(undefined)) &&
            <>
                <p>{"Added participants : "}</p>
                <ol>

                    {listEntries}
                </ol></>}

       {inputElement}
    </Fragment>
)

    

}
