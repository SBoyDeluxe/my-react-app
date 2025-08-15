import { useContext } from "react"
import { Header, HeaderProps } from "./Header"
import { TabRow, TabRowProps } from "./TabRow"
import { themeContext } from "../store/ThemeStore";


export type TabPageProps = {

    /**
     * 
     * @type {TabRowProps} The props specifying the TabRow to be displayed on the TabPage
     */
    tabRowProps : TabRowProps,
    /**
     * A function representing the contents of a specific tab with a specific tab number
     * 
     * @param number The activeTabNumber as seen in TabRowProps
     * @returns The contents of the tab to be displayed when the tab specified by the activeTabNumber is selected
     */
    tabs : (number)=>React.ReactNode

    headerProps : HeaderProps

}


export function TabPage({ headerProps,tabRowProps, tabs}:TabPageProps){
    const appThemeContext = useContext(themeContext);


    return(
        <>
             <Header cssClassName={headerProps.cssClassName} title={headerProps.title} titleClassName={headerProps.titleClassName}  key={(window.crypto.randomUUID())} headerColor={appThemeContext.primaryBackgroundColor}>
            
                                            <TabRow key={(window.crypto.randomUUID())} activeTabNumberState={tabRowProps.activeTabNumberState} pageNames={tabRowProps.pageNames} />
                                            
                                    </Header>
                                    {tabs(tabRowProps.activeTabNumberState)}
        </>

    )
}