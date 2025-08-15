import { createRoot } from 'react-dom/client';
import { ApplicationConfiguration } from '../application_config';
import Color from 'colorjs.io';
import * as React from 'react';
import { renderColors } from './RenderColors';
import { Button, ButtonProps } from './Button';
import { Background } from './background';
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
import { firebaseClientContext, UserStore, useUserStore } from '../store/UserStore';
import { LoadingStore, useLoadingStore } from './LoadingStore';
import { Project } from '../../project';
import { TimeConstraints } from '../../Timeconstraints';
import { start } from 'repl';

import { ClientInputData, ParticipantInputData } from './reducers/ParticipantInputReducer';
import { themeContext, useThemeStore } from '../store/ThemeStore';


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

export function App({  }: AppProps): React.ReactNode {
        const appThemeContext = React.useContext(themeContext);
        const firebaseClient = React.useContext(firebaseClientContext);
        const loadingStore = useLoadingStore();
        const userStore = useUserStore();
        const themeStore = useThemeStore();



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

        


        const [loginToggle, setLoginToggle] = React.useState(initToggle);
        const [theme, setTheme] = React.useState(initTheme);










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
                <firebaseClientContext.Provider value={firebaseClient}>
                        <themeContext.Provider value={themeStore}>
                                <Routes >
                                        <Route path='/' element={
                                                <>
                                                        <LoginRegistrationPage formState={formState} loading={loadingStore} login={login} loginToggle={loginToggle} setFormState={setFormState} setLoginToggle={setLoginToggle} signUp={signUp} themeState={themeState} >

                                                        </LoginRegistrationPage>
                                                </>
                                        }>

                                        </Route>
                                        <Route path='/logged-in' element={
                                                <>
                                                <LoggedInPage loading={loadingStore} themeState={themeState}  />

                                              
                                                </>
                                        }>

                                        </Route>
                                </Routes>
                        </themeContext.Provider>
                </firebaseClientContext.Provider>
        </>





        );


}







