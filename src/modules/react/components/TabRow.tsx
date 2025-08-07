import { CSSProperties, useContext } from "react"
import { State } from "./App"
import { Button } from "./Button"
import { ToggleButton } from "./ToggleButton"
import { themeContext } from "../context/ThemeContext"


export type TabRowProps = {
    /**
     * An array of strings of the text to be presented on each button 
     */
    pageNames: string[],
    /**
     * Represents what button should be labeled as active and its setter-function will be run 
     * upon the click of a non-selected button
     * @type {State<number>} 
     */
    activeTabNumberState : State<number>


}


export function TabRow({pageNames, activeTabNumberState}:TabRowProps){

    
        const appThemeContext = useContext(themeContext);

        let content : React.ReactNode = new Array(pageNames.length);

        function setButtonStyle(toggleState:boolean): CSSProperties {
            return (!toggleState) ? {
                  backgroundColor: appThemeContext.focusedContentColor,
                color: appThemeContext.focusedContrastColor,
               
            } : {
                  backgroundColor: appThemeContext.focusedBackgroundColor,
                color: appThemeContext.focusedContrastColor,
                 textDecoration: `double underline ${appThemeContext.focusedContrastColor}`
            };
        }
//`${tabText}-tab-button`
    pageNames.forEach((tabText, index)=>{
          let  isSelected : boolean = (index === activeTabNumberState.stateVariable);
        content[index] = (
                <>
                        <ToggleButton key={()=>(window.crypto.randomUUID())}  isDisabled={isSelected} cssClassName="tab-button" onClick={()=>activeTabNumberState.setState(index)} style={setButtonStyle((activeTabNumberState.stateVariable===index))}>
                            <p>{tabText}</p>
                        </ToggleButton>
                </>


        )
    });


    return content;



}