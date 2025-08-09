import { CSSProperties, Key, useContext } from "react"
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

         let keys : React.Key[] = pageNames.map((val)=>{
                return ( window.crypto.randomUUID().toString(),
                 window.crypto.randomUUID().toString())});
         let divKey : React.Key = window.crypto.randomUUID();
        const appThemeContext = useContext(themeContext);

     

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
    let content : React.ReactNode  = pageNames.map(
        (tabText, index)=>{
          let  isSelected : boolean = (index === activeTabNumberState.stateVariable);
         
         return (
                
                        <ToggleButton children={<p key={keys[keys.length-index]}>{tabText}</p>} key={keys[index]}  
                         isDisabled={isSelected} cssClassName="tab-button" onClick={()=>activeTabNumberState.setState(index)} 
                         style={setButtonStyle((activeTabNumberState.stateVariable===index))}>
                            
                        </ToggleButton>
                
                )
    });


    return (<>
            <div  className="tab-row">
                {(content)}
            </div>    
            </>);



}