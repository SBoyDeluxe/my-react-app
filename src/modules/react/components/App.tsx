import { createRoot } from 'react-dom/client';
import { ApplicationConfiguration } from '../application_config';
import Color from 'colorjs.io';
import * as React from 'react';
import { renderColors } from './RenderColors';
import { Button, ButtonProps } from './Button';
import { Background } from './background';
import { themeContext, themeContext } from '../context/ThemeContext'
import { LoginForm } from './LoginForm';
import { ToggleButton } from './ToggleButton';
import { CSSProperties, useMemo } from 'react';
import { TogglePair } from './TogglePair';
import { ButtonTest } from './AlexanderKnappar';
import { ThemeSelector } from './ThemeSelector';
import { Theme, ThemeValues } from '../../theme';
import { FirebaseAPIClient } from '../../firebaseapiClient';
import { User } from '../../User';
import { firebaseClientContext } from '../context/ClientContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { LoginRegistrationPage } from '../pages/LoginRegistrationPage';
import ReactRouter, { BrowserRouter, Route, Routes } from "react-router-dom"
import { TabRow } from './TabRow';


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
        async function login(username: string, password: string) {
                setLoading(true);
                const [error, user] = await catchError<User>(firebaseClient.loginUser(username, password));

                if (error) {
                        alert(error);
                }
                else {
                        console.log(user);
                }
        }
        const [userState, setUserState] = React.useState<(User | null)>(firebaseClient.currentUser);
        React.useEffect(() => {
                setUserState(firebaseClient.currentUser);

        }, [firebaseClient.currentUser]);

        function signUp(username: string, password: string) {
                setLoading(true);
                try {

                        firebaseClient.signUp(username, password).then((user) => {

                                //loading is done
                                setLoading(false);
                        }).catch((error) => console.log(error));

                } catch (error) {
                        alert(error)
                }

        }


        const [loginToggle, setLoginToggle] = React.useState(initToggle);
        const [theme, setTheme] = React.useState(initTheme);
        const [loading, setLoading] = React.useState(false);
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

        const activeTabNumberState : State<number> = {
                setState : setActiveTab,
                stateVariable : activeTabNumber
        };


        /**
         * <LoginRegistrationPage formState={formState} loading={loading} login={login} loginToggle={loginToggle} setFormState={setFormState} setLoginToggle={setLoginToggle} signUp={signUp} themeState={themeState} >

                                                         </LoginRegistrationPage>
         */

        return (<>
                <BrowserRouter>

                        <Routes>
                                <Route path='/' element={

                                        <themeContext.Provider value={theme}>
                                                <title>Scrumboard 3000 : Be agil!</title>
                                                <Background cssClassName='mainBackground' backgroundColor={theme.primaryBackgroundColor}>
                                                        <Header headerColor={theme.primaryBackgroundColor} renderContent={TabRow({ pageNames : ["yeah", "yeah", "yeah", "yeah", "yeah"], activeTabNumberState:activeTabNumberState})} />
                                                        {loading ? (<>
                                                                <img className="loading-indicator" src='https://icons8.com/preloaders/preloaders/1480/Fidget-spinner-128.gif'>

                                                                </img>
                                                        </>) : (<>


                                                                </>)}

                                                                         <>
                                                                        {userState?.username.username}
                                                                </>
                                                        <Footer content={<ThemeSelector themeState={themeState}></ThemeSelector>} />

                                                </Background>

                                        </themeContext.Provider>

                                }></Route>
                        </Routes>
                </BrowserRouter>



        </>)



}






