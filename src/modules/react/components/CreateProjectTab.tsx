import { Fragment, Key, ReactNode, useContext } from "react";
import { Form } from "./Form";
import { Input } from "./Input";
import { FieldSetOptions } from "./Form";
import { themeContext } from "../store/ThemeStore";
import { Button } from "./Button";
import * as React from "react";
import { Background } from "./background";
import { ClientInputData, ParticipantInputData, useParticipantReducer } from "./reducers/ParticipantInputReducer";

import { ApplicationConfiguration } from "../application_config";
import { firebaseClient, firebaseClientContext, UserStore } from "../store/UserStore";
import { LoadingStore } from "./LoadingStore";
import { Project } from "../../project";
import { TimeConstraints } from "../../Timeconstraints";
import { Manager, Developer, Client } from "../../User";
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
    createProject: (({ projectDescription, projectTitle, }: {
    projectTitle: string;
    projectDescription: string;
}, { projectClients, projectDevelopers, projectManagers }: {
    projectDevelopers: ParticipantInputData[];
    projectManagers: ParticipantInputData[];
    projectClients: ClientInputData[];
}, { projectEndTime, projectStartTime }: {
    projectStartTime: string;
    projectEndTime: string;
})=> void)

}


  



/**
 * The contents of the create project tab
 * 
 */
export function CreateProjectTab( ): ReactNode {



    const createProjectText = (<p>{"Create Project"}</p>);
    const fieldSetDateLegendText = (<p>{"Start-date -> End-date :"}</p>);
    const participantsLegendText = (<p>{"Add participants :"}</p>);
    const appThemeContext = useContext(themeContext);
    const fieldSetOptions: FieldSetOptions = { children: createProjectText, };
    const dateFieldSetOptions: FieldSetOptions = { children: fieldSetDateLegendText, textColor: appThemeContext.secondaryContentColor };
    const userStore = React.useSyncExternalStore(UserStore.subscribe, UserStore.getSnapshotUser);


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
        console.log(participantState);

        createProject({projectTitle:createProjectState.projectTitle, projectDescription : createProjectState.projectDescription}, {...participantState}, 
           {projectStartTime:createProjectState.projectStartTime, projectEndTime : createProjectState.projectEndTime});
        // if (createProjectState.projectTitle && createProjectState.projectDescription && createProjectState.projectStartTime && createProjectState.projectEndTime && participantState.projectManagers && participantState.projectDevelopers ) {
        //     createProject(createProjectState.projectTitle, createProjectState.projectDescription, createProjectState.projectStartTime, createProjectState.projectEndTime, participantState.projectManagers, participantState.projectDevelopers, participantState.projectClients);
        // }
    }




    return (

        <Form cssClassName="create-project-form" fieldSetOptions={fieldSetOptions} style={{
            backgroundColor: appThemeContext.primaryContentColor,
            border: `solid thin ${appThemeContext.secondaryContrastColor}`
        }}>
            <Input onEvent={handleChange} onInput={handleInput} inputState={createProjectState.projectTitle} inputType="text" labelName="Title :" name="projectTitle" cssClassName="project-title-input" />
            <Input onEvent={handleChange} onInput={handleInput} inputState={createProjectState.projectDescription} inputType="text" labelName="Project description :" name="projectDescription" cssClassName="project-description-input" />
            <Input onEvent={handleChange} onInput={handleInput} inputState={createProjectState.projectStartTime} inputType="datetime-local" labelName="Start time :" name="projectStartTime" cssClassName="project-start-time-input" />
            <Input onEvent={handleChange} onInput={handleInput} inputState={createProjectState.projectEndTime} inputType="datetime-local" labelName="End time :" name="projectEndTime" cssClassName="project-end-time-input" />
            <h3>Managers:</h3>
            <ParticipantInput onSubmitUser={(usernameInput, userTypeInput, userId) => participantDispatch({ type: "ADD_MANAGER_INPUT_DATA", payload: { username: usernameInput, userType: userTypeInput, userId } })} onRemoveUserType={(usernameInput, userTypeToRemove) => { participantDispatch({ type: "REMOVE_MANAGER_USER_TYPE", payload: { username: usernameInput, userType: userTypeToRemove } }) }} onAddUserType={(usernameInput, userType) => { participantDispatch({ type: "ADD_MANAGER_USER_TYPE", payload: { username: usernameInput, userType: userType } }) }} onRemoveUser={(username) => { participantDispatch({ type: "REMOVE_MANAGER_INPUT_DATA", payload: { username: username } }) }} participantInputDataList={participantState.projectManagers}></ParticipantInput>
            <br></br>
            <h3>Devs:</h3>
            <ParticipantInput onSubmitUser={(usernameInput, userTypeInput, userId) => participantDispatch({ type: "ADD_DEVELOPER_INPUT_DATA", payload: { username: usernameInput, userType: userTypeInput, userId : userId } })} onRemoveUserType={(usernameInput, userTypeToRemove) => { participantDispatch({ type: "REMOVE_DEVELOPER_USER_TYPE", payload: { username: usernameInput, userType: userTypeToRemove } }) }} onAddUserType={(usernameInput, userType) => { participantDispatch({ type: "ADD_DEVELOPER_USER_TYPE", payload: { username: usernameInput, userType: userType } }) }} onRemoveUser={(username) => { participantDispatch({ type: "REMOVE_DEVELOPER_INPUT_DATA", payload: { username: username } }) }} participantInputDataList={participantState.projectDevelopers}></ParticipantInput>
            <br></br>
            <h3>Clients</h3>
            <ParticipantInput onSubmitUser={(username, userTypeInut, userId) => { participantDispatch({ type: "ADD_CLIENT_INPUT_DATA", payload: { username: username, userId : userId } }) }} onRemoveUser={(username) => { participantDispatch({ type: "REMOVE_CLIENT_INPUT_DATA", payload: { username: username } }) }} participantInputDataList={participantState.projectClients}></ParticipantInput>
            <Button isDisabled={false} cssClassName="create-project-submit-button" children={createProjectText} onClick={handleClick}></Button>

        </Form>


    );

    function createProject({ projectDescription, projectTitle, }: {
    projectTitle: string;
    projectDescription: string;
}, { projectClients, projectDevelopers, projectManagers }: {
    projectDevelopers: ParticipantInputData[];
    projectManagers: ParticipantInputData[];
    projectClients: ClientInputData[];
}, { projectEndTime, projectStartTime }: {
    projectStartTime: string;
    projectEndTime: string;
}): void{

                LoadingStore.updateLoading();
                //Maps project devs, managers and clients in accordance with the format specified in the create project-form
                //The following should be known : Project always has at least 1 manager, all users added (inputData !== {"", ""|undefined, -1}) are verified users with userids
                //Everything else must be checked -> startDate < endDate, endDate >=today, startDate, currentUser included in developers || managers (clientUsers can only be invited)
                //projectTitle !== "" && projectDescription !== ""
                //  handleProjectCreationAsync(projectClients, projectStartTime, projectEndTime, projectTitle, projectDescription, projectManagers, projectDevelopers);
                //        const startDate = TimeConstraints.getLocalTimeParameters( new Date(projectStartTime));
                //        const endDate = TimeConstraints.getLocalTimeParameters( new Date(projectEndTime));
                //        const todaysDate = TimeConstraints.getLocalTimeParameters(new Date(Date.now())) ;
                const currentUser = userStore;
                const currentUserAsInput = { username: currentUser?.username.username, userId: currentUser?.authParameters.userId }
                const allVariablesExist = (projectTitle.trim() !== "") && (projectDescription.trim() !== "") && (projectStartTime.trim() !== "") && (projectEndTime.trim() !== "") && (projectManagers.length >= 1)
                        && ((projectManagers.filter((manager) => (manager.username === currentUserAsInput.username && manager.userId === currentUserAsInput.userId))[0] !== undefined) ||
                                (projectDevelopers.filter(dev => (dev.username === currentUserAsInput.username && dev.userId === currentUserAsInput.userId))[0]!==undefined));
                if (allVariablesExist) {
                        const startDate = new Date(projectStartTime);
                        const endDate = new Date(projectEndTime);
                        const todaysDate = new Date(Date.now());


                        const datesAreValid = ((endDate.getTime() >= startDate.getTime()) && (endDate.getTime() >= todaysDate.getTime()));

                        if(datesAreValid){
                                //All variables are valid -> We can now start construction of the project parameters
                                const timeConstraints = new TimeConstraints(startDate, endDate);

                                const managers = projectManagers.map((manager)=>{

                                        return new Manager(manager.userId, manager.username, manager.userType);
                                });
                                const developersExist = (projectDevelopers.filter((dev)=>dev.userId!==-1)[0]!==undefined)
                                const developers =developersExist ? projectDevelopers.map((developer)=>{

                                        return new Developer(developer.userId, developer.username, developer.userType);
                                }) 
                                : null;

                                const clientsExist = (projectClients.filter((client) => (client.userId === -1 && client.username === ""))[0] === undefined);

                                const clients = (clientsExist) ? (projectClients.map((client)=>new Client(client.username, client.userId))) : null;
                                const userIds = (clientsExist) ? projectManagers.concat(projectDevelopers).filter((vals)=>vals.userId!==-1).map((validInput)=>validInput.userId).concat(clients!.map((client)=>client.userId)) 
                                : projectManagers.concat(projectDevelopers).filter((vals)=>vals.userId!==-1).map((validInput)=>validInput.userId);


                                const project =  new Project(projectTitle, managers, clients, null, developers, projectDescription, timeConstraints );
                                
                                firebaseClient.createProject(project, userIds ).then(()=>{

                                        LoadingStore.updateLoading();
                                        alert("Project created!");
                                        console.log(project);
                                }).catch((error : Error) =>console.log(error));
                                

                        }
                }
        }

}
type ParticipantInputProps = {

    onAddUserType?: (username: string, userTypeInput: string) => void,

    onRemoveUserType?: (username: string, userTypeToRemove: string) => void,

    onRemoveUser: (username: string) => void,

    onSubmitUser: (username: string, userTypeInput?: string[], userId : number) => void,
    /**
     * Called to show the participants already input by the user as a list 
     * 
     */
    participantInputDataList: ParticipantInputData[] | ClientInputData[]
}
function ParticipantInput({ participantInputDataList, onAddUserType, onRemoveUser, onRemoveUserType, onSubmitUser }: ParticipantInputProps) {


    /*Should have implemented an early type check => boolean  */
    const isClientInputData = Object.keys(participantInputDataList[0]).length === 2;

    //Used to target people from list
    const [selectedUsername, setSelectedUsername] = React.useState(UserStore.getSnapshotUser()?.username.username);

    const [userInput, setUserInput] = (isClientInputData) ? React.useState({ usernameInput: "" }) : React.useState({ usernameInput: "", userTypeInput: "" });

    const appFirebaseClientContext = useContext(firebaseClientContext);
    let handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { };
    let handleInput = (event: React.FormEvent<HTMLInputElement>) => { };


    let inputElement = (<></>);
    let listElement = (<></>);
    let userTypeButtons = (<></>);


    if (!isClientInputData) {

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

            <Input onInput={handleInput} onEvent={handleChange} inputState={userInput.usernameInput} inputType="text" name="usernameInput" labelName="Add user :" cssClassName="add-participant-username-input" />


            <Button onClick={(e) => {
                e.preventDefault(); e.stopPropagation(); if (userInput.usernameInput && !(participantInputDataList.filter((participant) => participant.username === userInput.usernameInput)[0])) {
                    //check username-existence
                   appFirebaseClientContext.getUserIds([userInput.usernameInput]).then((userId) => {

                        return userId[0];
                    }).then((userId) => {
                        const isSuccess = (userId !== null);

                        if (isSuccess) {
                            onSubmitUser(userInput.usernameInput, [userInput.userTypeInput], userId); 
                            setSelectedUsername(userInput.usernameInput);
                        }
                        else {
                            alert(`${userInput.usernameInput} was not found in our database, please try again!`)
                        }
                    }).catch((error: Error) => {
                        console.log(error);
                    }).finally(() => resetInputFields(setUserInput));
                }
            }} id="submit-user-button" cssClassName="participant-input-button">
                <p>{"Add :"}</p>
            </Button>

        </>);

        userTypeButtons = (<> <Button onClick={(e) => {
            e.preventDefault(); e.stopPropagation();
            //Check wheter the userType-array has been initialized, if so compare input to see the type is not already included


            if (userInput.userTypeInput.trim() !== "" && !selectedUser.userType.includes(userInput.userTypeInput)) {
                handleOnAddUserTypeClick({ usernameInput: selectedUsername, userTypeInput: userInput.userTypeInput }, setUserInput)
            }
        }} id="usertype-add-button" cssClassName="participant-input-button">
            <p>{"+"}</p>
        </Button>
            <Button onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                if (userInput.userTypeInput.trim() !== "" && selectedUser.userType.includes(userInput.userTypeInput)) {
                    handleOnRemoveUserTypeClick({ usernameInput: selectedUsername!, userTypeInput: userInput.userTypeInput }, setUserInput)
                }
            }}
                id="usertype-remove-button" cssClassName="participant-input-button" children={(<p>{"-"}</p>)} /> </>)
    }
    else {
        handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

            e.stopPropagation();

            setUserInput((prev) => ({
                usernameInput: e.target.value
            }));
        };



        handleInput = (event: React.FormEvent<HTMLInputElement>) => {
            event.stopPropagation();
            setUserInput((prev) => ({
                usernameInput: event.target.value
            }));
        };
        inputElement = (<>

            <Input onInput={handleInput} onEvent={handleChange} inputState={userInput.usernameInput} inputType="text" name="usernameInput" labelName="Enter username :" cssClassName="add-client-username-input" />
            <Button onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (userInput.usernameInput) {
                         appFirebaseClientContext.getUserIds([userInput.usernameInput]).then((userId) => {

                        return userId[0];
                    }).then((userId) => {
                        const isSuccess = (userId !== null);

                        if (isSuccess) {
                           onSubmitUser(userInput.usernameInput, undefined, userId); 
                           setSelectedUsername(userInput.usernameInput); 
                           setUserInput({ usernameInput: "" });
                        }
                        else {
                            alert(`${userInput.usernameInput} was not found in our database, please try again!`)
                        }
                    }).catch((error: Error) => {
                        console.log(error);
                    })
                 } }} id="submit-user-button" cssClassName="participant-input-button">
                <p>{"Add :"}</p>
            </Button>
        </>);



    }
    let keys: Key[] = new Array<Key>(participantInputDataList.length);
    for (let i = 0; i < keys.length; i++) {

        keys[i] = self.crypto.randomUUID();
    }



    let listEntries = participantInputDataList.map((participantInputData, index) => {

        if (Object.keys(participantInputData).length === 2) {
            if (participantInputData.username.trim() !== "") {
                //Means we have client input and should only show username
                return (

                    < option key={keys[index]} value={participantInputData.username}>{`Username : ${participantInputData.username}`} </option>

                )
            }
        }
        else {
            if (participantInputData.username.trim() !== "") {
                return (

                    <option key={keys[index]} value={participantInputData.username}>{`Username : ${participantInputData.username} | User-types : ${participantInputData.userType}`}</option>
                )
            }
        }
    });
    let selectedUser = participantInputDataList.filter((participant) => participant.username === selectedUsername)[0];
    let userTypeOptions = (<></>)
    if (Object.keys(participantInputDataList[0]).length > 2 && selectedUser) {
        let keysForUserTypeOptions = new Array<Key>(selectedUser.userType.length);
        for (let i = 0; i < keysForUserTypeOptions.length; i++) {
            keysForUserTypeOptions[i] = self.crypto.randomUUID();
        }
        let counter = 0;
        userTypeOptions = selectedUser.userType.map((usertype, index) => {




            return (
              
                < option key={keysForUserTypeOptions[index]} value={usertype}></option>
            )



        });
    }

    //The list where you can handle already added users
    listElement = (<details>
        <summary >{"Added participants : "}</summary>
        <label htmlFor="added-users-select">{"Selected user :"}</label>

        <select value={selectedUsername} onChange={(e) => { e.stopPropagation(); (setSelectedUsername(e.target.value)); selectedUser = participantInputDataList.filter((participant) => participant.username === e.target.value)[0]; }} id="added-users-select">

            {listEntries}
        </select>

        <Button isDisabled={false} onClick={(e) => {
            e.preventDefault(); e.stopPropagation();

            handleRemoveUserClick();

        }} cssClassName="participant-input-button" children={(<p>{"Remove user with username from list"}</p>)}
        />
        {Object.keys(participantInputDataList[0]).length > 2 &&
            <>
                <Input list="selected-user-usertypes" onEvent={handleChange} onInput={handleInput} inputState={userInput.userTypeInput} inputType="text" name="userTypeInput" labelName="Add/remove user-type :" cssClassName="add-participant-usertype-input" />

                <datalist id="selected-user-usertypes">
                    {userTypeOptions}
                </datalist>
                {userTypeButtons}
            </>}
    </details>)


    return (
        <Fragment>
            <Background cssClassName="participant-input-container">
                {(listEntries[0] !== (undefined)) &&
                    listElement
                }
                {inputElement}
            </Background>
        </Fragment >
    );


    function handleRemoveUserClick() {

        onRemoveUser(selectedUsername!);



    }

    function handleOnRemoveUserTypeClick(userInput: { usernameInput: string; userTypeInput: string; }, setUserInput: React.Dispatch<React.SetStateAction<{ usernameInput: string; userTypeInput: string; }>>): React.MouseEventHandler<HTMLButtonElement> {
        if (userInput.userTypeInput && userInput.usernameInput) {
            onRemoveUserType!(userInput.usernameInput, userInput.userTypeInput);
            resetInputFields(setUserInput, "userTypeInput");
        }

    }

    function handleOnAddUserTypeClick(userInput: { usernameInput: string; userTypeInput: string; }, setUserInput: React.Dispatch<React.SetStateAction<{ usernameInput: string; userTypeInput: string; }>>): React.MouseEventHandler<HTMLButtonElement> {

        if (userInput.userTypeInput && userInput.usernameInput) {
            onAddUserType!(userInput.usernameInput, userInput.userTypeInput); resetInputFields(setUserInput, "userTypeInput");
        }

    }

    /**
     * Sets one or both user inputs of username and userType to ""
     * 
     * @param setUserInput The setter function of the input variables
     * @param fieldOption The specific field to be reset, if fieldOption is left out both fields are reset
     */
    function resetInputFields(setUserInput: React.Dispatch<React.SetStateAction<{ usernameInput: string; userTypeInput: string; }>>, fieldOption?: "usernameInput" | "userTypeInput") {


        const fieldOptionIsDefined = (fieldOption) ? true : false;

        switch (fieldOptionIsDefined) {
            case false: {
                //No field option specified -> Means both fields should be reset

                setUserInput({ usernameInput: "", userTypeInput: "" });
            }

                break;

            default: {

                setUserInput((prevState) => {
                    return ({
                        ...prevState,
                        [fieldOption!]: ""
                    });
                });
            }
                break;
        }
    }

}


