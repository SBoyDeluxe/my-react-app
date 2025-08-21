import * as React from "react";
import { ThemeValues } from "../../theme";
import { State } from "../components/App";
import { Background } from "../components/background";
import { CreateProjectTab } from "../components/CreateProjectTab";
import { Footer } from "../components/Footer";
import { Header, HeaderProps } from "../components/Header";
import { InboxTab } from "../components/InboxTab";
import { ThemeSelector } from "../components/ThemeSelector";
import { themeContext } from "../context/ThemeContext";
import { Button } from "../components/Button";
import { MailboxStore, UserStore } from "../store/UserStore";
import { TabPage } from "../components/TabPage";
import { ProjectsTab } from "../components/ProjectsTab";
import { TabRow } from "../components/TabRow";




export function LoggedInPage({ loading, themeState, }: { loading: boolean; themeState: State<ThemeValues> }
): React.ReactNode {
        const [activeTabNumber, setActiveTab] = React.useState(0);
        const activeTabNumberState: State<number> = {
                setState: setActiveTab,
                stateVariable: activeTabNumber
        };
        const appThemeContext = React.useContext(themeContext);

        const userState = React.useSyncExternalStore(UserStore.subscribe, UserStore.getSnapshotUser);
        const mailboxState = React.useSyncExternalStore(MailboxStore.subscribe, MailboxStore.getSnapshotMailbox);

        const tabPageHeaderProps: HeaderProps = {
                cssClassName: "tab-page-header",
                title: `Welcome : ${userState?.username.username}`,
                titleClassName: "header-welcome-message"
        };

        // const tabRowProps: TabRowProps = {
        // <CreateProjectTab createProject={createProject} setCreateProjectState={setProjectFormState}  inputState={projectFormState}></CreateProjectTab>
        //         activeTabNumberState: activeTabNumberState,
        //         pageNames: ["Schedule", "Projects", "Inbox", "Create project"]
        // }

        function handleLogOutClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
                //Make sure submit isn´t run
                e.preventDefault();
                e.stopPropagation();

                UserStore.logOut().then(() => {
                        //page change is handled at <App> level
                        alert("You have been logged out!")

                });




        }
        return (
                <>
                        <Background cssClassName='mainBackground' backgroundColor={appThemeContext.primaryBackgroundColor}>

                                <Header headerColor={appThemeContext.primaryBackgroundColor}>
                                        <h3>{`Welcome ${userState?.username.username}`}</h3>
                                        <Button isDisabled={false} cssClassName="log-out-button" children={<p>{"Log out"}</p>} onClick={(e) => (handleLogOutClick(e))} ></Button>
                                        <TabRow activeTabNumberState={{
                                                stateVariable: activeTabNumberState.stateVariable,
                                                setState: activeTabNumberState.setState
                                        }} pageNames={["Create Project", "Inbox", "Projects"]}></TabRow>
                                </Header>
                                {loading ? (<>
                                        <img className="loading-indicator" src='https://icons8.com/preloaders/preloaders/1480/Fidget-spinner-128.gif'>

                                        </img>
                                </>) : (<>


                                </>)}

                                <TabPage activeTabState={{
                                        stateVariable: activeTabNumberState.stateVariable,
                                        setState: activeTabNumberState.setState
                                }} tabs={function (tabState: number): React.ReactNode {
                                        switch (activeTabNumberState.stateVariable) {

                                                case 0: {

                                                        return (<>
                                                                <CreateProjectTab></CreateProjectTab>
                                                        </>)
                                                }
                                                        break;
                                                case 1: {
                                                        return (<><InboxTab mailBoxContents={mailboxState!}></InboxTab>
                                                        </>
                                                        )
                                                }
                                                        break;
                                                case 2: {
                                                        return (<><ProjectsTab></ProjectsTab>
                                                        </>)
                                                }
                                                        break;
                                                default: break;
                                        }
                                }} headerProps={tabPageHeaderProps}></TabPage>

                                <Footer content={<ThemeSelector themeState={themeState}></ThemeSelector>} />

                        </Background>
                </>
        )


}
