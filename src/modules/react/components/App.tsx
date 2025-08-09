import { createRoot } from 'react-dom/client';
import { ApplicationConfiguration } from '../application_config';
import Color from 'colorjs.io';
import * as React from 'react';
import { renderColors } from './RenderColors';
import { Button, ButtonProps } from './Button';
import { Background } from './background';
import { themeContext } from '../context/ThemeContext'
import { LoginForm } from './LoginForm';
import { ToggleButton } from './ToggleButton';
import { CSSProperties, useMemo } from 'react';
import { TogglePair } from './TogglePair';
import { ButtonTest } from './AlexanderKnappar';
import { ThemeSelector } from './ThemeSelector';
import { Theme, ThemeValues } from '../../theme';
import { FirebaseAPIClient } from '../../firebaseapiClient';
import { Client, Developer, Manager, User } from '../../User';
import { Header } from './Header';
import { Footer } from './Footer';
import { LoginRegistrationPage } from '../pages/LoginRegistrationPage';
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom"
import { TabRow } from './TabRow';
import { LoggedInPage } from '../pages/LoggedInPage';
import { UserStore, useUserStore } from '../store/UserStore';
import { LoadingStore, useLoadingStore } from './LoadingStore';
import { Project } from '../../project';
import { TimeConstraints } from '../../Timeconstraints';
import { start } from 'repl';


/**
 * Describe a React-state, a value that may change during run-time and should trigger a re-render
 */
export type State<T> = {
        stateVariable: T,
        setState: React.Dispatch<React.SetStateAction<T>>


}

export type ClickHandler = {
        onClick: React.MouseEventHandler,


}


/**
      * An initialization function, this makes sure that the theme-state isn´t re-declared
      * each re-render
      * 
      * @returns {ThemeValues}
      */
function initTheme() {
        return Theme.generateTheme([new Color("#c4ccc8c2")], 0, 0)


}

/**
* An initialization function, this makes sure that the theme-state isn´t re-declared
* each re-render
* 
* @returns {boolean}
*/
function initToggle() {
        return true;
}

export type AppProps = {
        /**
         * Used to call for all of the external webcalling and handling of login, encryption, decryption etc.
         * 
         */
        firebaseClient: FirebaseAPIClient
}

function catchError<T>(promise: Promise<T>): Promise<(T | undefined)[] | [Error]> {

        return promise.then((value) => { return [undefined, value] }).catch((error: Error) => {

                return [error];
        })
}

export function App({ firebaseClient }: AppProps): React.ReactNode {
        const appThemeContext = React.useContext(themeContext);
        const loadingStore = useLoadingStore();
        const userStore = useUserStore();
        const [createProjectState, setCreateProjectState] = React.useState({
                projectTitle: "",
                projectDescription: "",
                projectStartTime: "",
                projectEndTime: "",
                projectManagers: "",
                projectDevelopers: "",
                projectClients: ""
        });

       const projectState = useMemo(()=>createProjectState, [createProjectState]);
        const navigate = useNavigate();
        //When a change in the user-state happens we now someone have logged in, signed up or logged out <=> logged out/not logged in yet : userStore === null
        // || logged-in/signed-up <=> userStore !== null && loadingStore ==false
        const handlePageChange = React.useEffect(() => {
                if (userStore == null && loadingStore === false) {
                        navigate("/");

                }
                else if (userStore && loadingStore === false) {

                        navigate("/logged-in");
                }

        }, [loadingStore]);



        function login(username: string, password: string) {

                try {



                        UserStore.login(username, password);





                } catch (error) {
                        alert(error)
                }
        }


        function signUp(username: string, password: string) {

                try {
                        UserStore.signUpUser(username, password);
                        // firebaseClient.signUp(username, password).then((user) => {

                        //         //loading is done
                        //         setLoading(false);
                        //         setUserState(user);


                        // }).then(()=>window.location.assign(`${(window.location.href.includes("?")) ? window.location.href.split("?")[0] : window.location.href}logged-in`))
                        //  .catch((error) => console.log(error));

                } catch (error) {
                        alert(error)
                }

        }

        function createProject(
                projectTitle: string,
                projectDescription: string,
                projectStartTime: string,
                projectEndTime: string,
                projectManagers: string,
                projectDevelopers: string,
                projectClients: string,
        ) {

                LoadingStore.updateLoading();
                //Maps project devs, managers and clients in accordance with the format specified in the create project-form
                 handleProjectCreationAsync(projectClients, projectStartTime, projectEndTime, projectTitle, projectDescription, projectManagers, projectDevelopers);
        }


        const [loginToggle, setLoginToggle] = React.useState(initToggle);
        const [theme, setTheme] = React.useState(initTheme);
        const [activeTabNumber, setActiveTab] = React.useState(0);









        /**
         * A state that keeps track of the user entry into the login form
         * 
         */
        const [formState, setFormState] = React.useState(() => ({

                username: "",
                password: ""
        }));




        const themeState: State<ThemeValues> = useMemo(() => {

                return {
                        stateVariable: theme,
                        setState: setTheme

                }
        }, [theme]);

        const activeTabNumberState: State<number> = {
                setState: setActiveTab,
                stateVariable: activeTabNumber
        };

        // const projectState: State<{
        //         projectTitle: string;
        //         projectDescription: string;
        //         projectStartTime: string;
        //         projectEndTime: string;
        //         projectManagers: string;
        //         projectDevelopers: string;
        //         projectClients: string;
        // }> = {
        //         setState: setCreateProjectState,
        //         stateVariable: createProjectState

        // };


        /**
         * 
         */

        return (<>
                <themeContext.Provider value={theme}>
                <Routes key={(window.crypto.randomUUID())}>
                        <Route key={(window.crypto.randomUUID())} path='/' element={
                                <>
                                <LoginRegistrationPage  key={(window.crypto.randomUUID())}  formState={formState} loading={loadingStore} login={login} loginToggle={loginToggle} setFormState={setFormState} setLoginToggle={setLoginToggle} signUp={signUp} themeState={themeState} >

                                </LoginRegistrationPage>
                                </>
                        }>
                                
                        </Route>
                        <Route key={(window.crypto.randomUUID())} path='/logged-in' element={

                                <LoggedInPage key={(window.crypto.randomUUID())} setProjectFormState={setCreateProjectState}  createProject={createProject} projectFormState={projectState} loading={loadingStore} userState={userStore} activeTabNumberState={activeTabNumberState} theme={theme} themeState={themeState} >

                                </LoggedInPage>

                        }></Route>
                </Routes>
               </themeContext.Provider>         
                        </>





        );




         async function handleProjectCreationAsync(projectClients: string, projectStartTime: string, projectEndTime: string, projectTitle: string, projectDescription: string, projectManagers: string, projectDevelopers: string) {
                const managers = mapProjectManagers();
                const devs = mapProjectDevs();
                const clientUsernames = projectClients.trim().split(",");
                const managersUserNames: string[] = managers.map((manager) => {

                        return manager.managerUsername;
                });
                const devsUserNames: string[] = devs.map((dev) => {

                        return dev.developerUsername;
                });

                const userIds = await getUserIdsFromUsernames(managersUserNames, devsUserNames, clientUsernames);

                const wrongUsernameCollection = mapWrongUsernames(userIds);

                //Filter out invalid users
                const validDevs = userIds.devUserIds.map((devId, index) => {

                        //If devId !== null <=> devs[index] contains valid date
                        if (devId) {

                                return ({ devUserId: devId, devEntry: devs[index] });


                        }
                });
                const validManagers = userIds.managerUserIds.map((managerId, index) => {

                        //If managerId !== null <=> managers[index] contains valid date
                        if (managerId) {

                                return ({ managerUserId: managerId, managerEntry: managers[index] });


                        }
                });
                const validClients = userIds.clientUserIds.map((clientId, index) => {

                        //If clientId !== null <=> clients[index] contains valid date
                        if (clientId) {

                                return ({ clientUserId: clientId, clientUsername: clientUsernames[index] });


                        }
                });
                const validClientUserIds = userIds.clientUserIds.filter((value) => (value !== null));
                const validDevUserIds = userIds.devUserIds.filter((value) => (value !== null));
                const validManagerUserIds = userIds.managerUserIds.filter((value) => (value !== null));




                //Convert date-strings to Date objects to make TimeContstraints
                const startDate = new Date(projectStartTime);
                const endDate = new Date(projectEndTime);

                //Instantiate Clients, Managers and Developers
                const instantiatedManagers: Manager[] = validManagers.map((manager) => { return (new Manager(manager?.managerUserId!, manager?.managerEntry.managerUsername!, manager?.managerEntry.managerTypes!)); });

                const instantiatedDevs: Developer[] = validDevs.map((dev) => { return (new Developer(dev?.devUserId!, dev?.devEntry.developerUsername!, dev?.devEntry.developerTypes!)); });

                const instantiatedClients: Client[] = validClients.map((client) => { return (new Client(client?.clientUsername!, client?.clientUserId!)); });



                //Create new project and post it with firebaseClient.createProject() -> Creates the project inside the database and invites the valid users
                const newProject: Project = new Project(projectTitle, instantiatedManagers, instantiatedClients, null, instantiatedDevs, projectDescription, new TimeConstraints(startDate, endDate));

                await firebaseClient.createProject(newProject, (validClientUserIds.concat(validDevUserIds).concat(validManagerUserIds).concat(userStore?.authParameters.userId!))).then(() => {

                        LoadingStore.updateLoading();
                        alert(`The following usernames were not found in our database : \n Clients : ${wrongUsernameCollection.wrongUsernameClientCollection} \n Developers : ${wrongUsernameCollection.wrongUsernameDeveloperCollection} \n Managers : ${wrongUsernameCollection.wrongUsernameDeveloperCollection}`);
                });









                function mapWrongUsernames(userIds: {
                        managerUserIds: (number | null)[];
                        devUserIds: (number | null)[];
                        clientUserIds: (number | null)[];
                }) {
                        const wrongUsernameClientCollection = userIds.clientUserIds.map((val, index) => {
                                if (val === null) {
                                        return clientUsernames[index];
                                }
                        });
                        const wrongUsernameDeveloperCollection = userIds.devUserIds.map((val, index) => {
                                if (val === null) {
                                        return devsUserNames[index];
                                }
                        });
                        const wrongUsernameManagersCollection = userIds.managerUserIds.map((val, index) => {
                                if (val === null) {
                                        return managersUserNames[index];
                                }
                        });

                        return { wrongUsernameManagersCollection, wrongUsernameDeveloperCollection, wrongUsernameClientCollection };
                }

                async function getUserIdsFromUsernames(managersUserNames: string[], devsUserNames: string[], clientUsernames: string[]) {
                        let managerUserIds: (number | null)[] = [null];
                        let devUserIds: (number | null)[] = [null];
                        let clientUserIds: (number | null)[] = [null];

                        if (managersUserNames) {
                                managerUserIds = await firebaseClient.getUserIds(managersUserNames);
                        }

                        if (devsUserNames) {
                                devUserIds = await firebaseClient.getUserIds(devsUserNames);
                        }

                        if (clientUsernames) {

                                clientUserIds = await firebaseClient.getUserIds(clientUsernames);
                        }

                        return { managerUserIds, devUserIds, clientUserIds };
                }

                function mapProjectManagers() {
                        const managers = projectManagers.trim().split(";");
                        const managerEntries = managers.map((managerEntryString) => {
                                const managerUsername: string = managerEntryString.split(":")[0];
                                const managerTypes: string[] = managerEntryString.split(":")[1].split(`,`);
                                return { managerUsername, managerTypes };
                        });
                        return managerEntries;
                }
                function mapProjectDevs() {
                        const developers = projectDevelopers.trim().split(";");
                        const developerEntries = developers.map((developerEntryString) => {
                                const developerUsername: string = developerEntryString.split(":")[0];
                                const developerTypes: string[] = developerEntryString.split(":")[1].split(`,`);
                                return { developerUsername, developerTypes };
                        });
                        return developerEntries;
                }
        }
}







