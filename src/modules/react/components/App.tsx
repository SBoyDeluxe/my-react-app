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
import { User } from '../../User';
import { firebaseClientContext } from '../context/ClientContext';

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
        firebaseClient : FirebaseAPIClient
}

 function catchError<T>(promise : Promise<T>) : Promise<(T | undefined)[] | [Error]>{

       return promise.then((value)=>{return [undefined,value]}).catch((error : Error)=>{

                return [error];
        })
}

export function App({firebaseClient }:AppProps): React.ReactNode {
       // const FirebaseContext = React.useContext(firebaseClientContext);
        async function login(username : string, password:string){
                setLoading(true);
        const [error, user]  = await catchError<User>(  firebaseClient.loginUser(username, password));

        if(error){
                alert(error);
        }
        else{
                console.log(user);
        }
        }
       //  const FirebaseClientContext = React.createContext(firebaseClient);
        const [userState, setUserState] = React.useState<(User|null)>(null);
        React.useEffect(()=>{
                setUserState(firebaseClient.currentUser);
                
        },[firebaseClient.currentUser]);

        function signUp(username : string, password:string){
                setLoading(true);
                try {

                        firebaseClient.signUp(username, password).then((user)=>{

                        //loading is done
                        setLoading(false);
                }).catch((error)=>console.log(error)); 
                        
                } catch (error) {
                 alert(error)       
                }
                
        }
       

        const [loginToggle, setLoginToggle] = React.useState(initToggle);
        const [theme, setTheme] = React.useState(initTheme);
        const [loading, setLoading] = React.useState(false);

        







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
}, [theme])




return (<>
       
        <themeContext.Provider value={themeState.stateVariable}>
                <title>Scrumboard 3000 : Be agil!</title>
                <Background cssClassName='mainBackground' backgroundColor={themeState.stateVariable.primaryBackgroundColor}>
                                {loading ? (<>  
                                                <img style = {{zIndex : 10000, alignSelf : "center", backgroundColor : "red"}} src='https://icons8.com/preloaders/preloaders/1480/Fidget-spinner-128.gif'>
                                                        
                                                </img>
                                           </>      ) :( <></>)          }
                                              <LoginForm signUp={signUp} login={login} formState={formState} 
                         toggleState={{
                                setState: setLoginToggle,
                                stateVariable: loginToggle
                        }} setFormState={setFormState} ></LoginForm>
                     

                        <ThemeSelector themeState={themeState} ></ThemeSelector>

                </Background>

        </themeContext.Provider>
       
</>);



}






