import { useContext } from "react";
import { ThemeValues } from "../../theme";
import { User } from "../../User";
import { State } from "../components/App";
import { Background } from "../components/background";
import { CreateProjectTab } from "../components/CreateProjectTab";
import { Footer } from "../components/Footer";
import { Header, HeaderProps } from "../components/Header";
import { InboxTab } from "../components/InboxTab";
import { TabRow, TabRowProps } from "../components/TabRow";
import { ThemeSelector } from "../components/ThemeSelector";
import { themeContext } from "../context/ThemeContext";
import { ProjectCreationForm } from "../components/ProjectCreationForm";




export function LoggedInPage({  activeTabNumberState, loading, userState, themeState, createProject, setProjectFormState, projectFormState }: {
        setProjectFormState: React.Dispatch<React.SetStateAction<{
                projectTitle: string;
                projectDescription: string;
                projectStartTime: string;
                projectEndTime: string;
                projectManagers: string;
                projectDevelopers: string;
                projectClients: string;
        }>>;
        projectFormState: {
                projectTitle: string;
                projectDescription: string;
                projectStartTime: string;
                projectEndTime: string;
                projectManagers: string;
                projectDevelopers: string;
                projectClients: string;
        };
        activeTabNumberState: State<number>; loading: boolean; userState: User | null; themeState: State<ThemeValues>; createProject: (
                projectTitle: string,
                projectDescription: string,
                projectStartTime: string,
                projectEndTime: string,
                projectManagers: string,
                projectDevelopers: string,
                projectClients: string,
        ) => void;
}): React.ReactNode {


         const appThemeContext = useContext(themeContext);
        // const tabPageHeaderProps: HeaderProps = {
        //         cssClassName: "tab-page-header",
        //         title: `Welcome : ${userState?.username.username}`,
        //         titleClassName: "header-welcome-message"

        // };

        // const tabRowProps: TabRowProps = {
        // <CreateProjectTab createProject={createProject} setCreateProjectState={setProjectFormState}  inputState={projectFormState}></CreateProjectTab>
        //         activeTabNumberState: activeTabNumberState,
        //         pageNames: ["Schedule", "Projects", "Inbox", "Create project"]
        // }
        return (
               
                <Background key={(window.crypto.randomUUID())} cssClassName='mainBackground' backgroundColor={appThemeContext.primaryBackgroundColor}>
                         <title>Scrumboard 3000 : Be agil!</title>
                        <Header key={(window.crypto.randomUUID())} headerColor={appThemeContext.primaryBackgroundColor}>

                        </Header>
                        {loading ? (<>
                                <img key={window.crypto.randomUUID()} className="loading-indicator" src='https://icons8.com/preloaders/preloaders/1480/Fidget-spinner-128.gif'>

                                </img>
                        </>) : (<>


                        </>)}

                        <ProjectCreationForm key={window.crypto.randomUUID()} ></ProjectCreationForm>
                              
                        <Footer key={(window.crypto.randomUUID())} content={<ThemeSelector key={window.crypto.randomUUID()} themeState={themeState}></ThemeSelector>} />

                </Background>
        
        );
}
