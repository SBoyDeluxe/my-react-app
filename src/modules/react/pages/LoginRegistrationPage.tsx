import { ThemeValues } from "../../theme";
import { State } from "../components/App";
import { Background } from "../components/background";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { LoginForm } from "../components/LoginForm";
import { ThemeSelector } from "../components/ThemeSelector";
import { themeContext } from "../context/ThemeContext";







export function LoginRegistrationPage({ themeState, loading, signUp, login, formState, setLoginToggle, loginToggle, setFormState }: { themeState: State<ThemeValues>; loading: boolean; signUp: (username: string, password: string) => void; login: (username: string, password: string) => void; formState: { username: string; password: string; }; setLoginToggle: React.Dispatch<React.SetStateAction<boolean>>; loginToggle: boolean; setFormState: React.Dispatch<React.SetStateAction<{ username: string; password: string; }>>; }): React.ReactNode {

        
        return (<>

                <themeContext.Provider value={themeState.stateVariable}>
                        <title>Scrumboard 3000 : Be agil!</title>
                        <Background cssClassName='mainBackground' backgroundColor={themeState.stateVariable.primaryBackgroundColor}>
                                <Header headerColor={themeState.stateVariable.primaryBackgroundColor} />
                                {loading ? (<>
                                        <img className="loading-indicator" src='https://icons8.com/preloaders/preloaders/1480/Fidget-spinner-128.gif'>

                                        </img>
                                </>) : (<><LoginForm signUp={signUp} login={login} formState={formState}
                                        toggleState={{
                                                setState: setLoginToggle,
                                                stateVariable: loginToggle
                                        }} setFormState={setFormState}></LoginForm></>)}
                                

                                <Footer content={<ThemeSelector themeState={themeState}></ThemeSelector>} />

                        </Background>

                </themeContext.Provider>

        </>)
}