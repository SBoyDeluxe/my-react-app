import { useContext } from "react"
import { Header, HeaderProps } from "./Header"
import { TabRow, TabRowProps } from "./TabRow"
import { themeContext } from "../context/ThemeContext"
import { State } from "./App"


export type TabPageProps = {

    /**
     * 
     * @type {TabRowProps} The props specifying the TabRow to be displayed on the TabPage
     */
    tabRowProps? : TabRowProps,
    /**
     * A function representing the contents of a specific tab with a specific tab number
     * 
     * @param number The activeTabNumber as seen in TabRowProps
     * @returns The contents of the tab to be displayed when the tab specified by the activeTabNumber is selected
     */
    tabs : (number)=>React.ReactNode,

    headerProps : HeaderProps,

    activeTabState : State<number>

}


export function TabPage({ activeTabState, headerProps,tabRowProps=null, tabs}:TabPageProps){
    const appThemeContext = useContext(themeContext);

    const tabRow = (tabRowProps!== null) ?  <Header cssClassName={headerProps.cssClassName} title={headerProps.title} titleClassName={headerProps.titleClassName}  headerColor={appThemeContext.primaryBackgroundColor}>
            
                                            <TabRow activeTabNumberState={tabRowProps.activeTabNumberState} pageNames={tabRowProps.pageNames} /> </Header> : (<></>);


    return(
        
                                    <>        
                                    {tabs(activeTabState)}
                                </>
    )
}