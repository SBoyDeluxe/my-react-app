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
import React from "react";




export function LoggedInPage({loading, userState, themeState, createProject, setProjectFormState, projectFormState }: {
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
     createProject: (
                projectTitle: string,
                projectDescription: string,
                projectStartTime: string,
                projectEndTime: string,
                projectManagers: string,
                projectDevelopers: string,
                projectClients: string,
        ) => void;
}): React.ReactNode {
          const [activeTabNumber, setActiveTab] = React.useState(0);
          const activeTabNumberState: State<number> = {
                setState: setActiveTab,
                stateVariable: activeTabNumber
        };
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
               
                <Background  cssClassName='mainBackground' backgroundColor={appThemeContext.primaryBackgroundColor}>
                        
                        <Header  headerColor={appThemeContext.primaryBackgroundColor}>

                        </Header>
                        {loading ? (<>
                                <img  className="loading-indicator" src='https://icons8.com/preloaders/preloaders/1480/Fidget-spinner-128.gif'>

                                </img>
                        </>) : (<>


                        </>)}

                    <CreateProjectTab createProject={createProject}></CreateProjectTab>
                              
                        <Footer  content={<ThemeSelector  themeState={themeState}></ThemeSelector>} />

                </Background>
        
        );
}
