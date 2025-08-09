import { CSSProperties, useContext, MouseEventHandler } from "react"
import { themeContext } from "../context/ThemeContext"
import { ToggleButton } from "./ToggleButton";
import React from "react";
import { ClickHandler, State } from "./App";

export type TogglePairProps = {
            toggleState : State<boolean>,
}

export function TogglePair( 
            {toggleState}:TogglePairProps){
                
          let toggleVal = toggleState.stateVariable;
      
          function handleClick(event :  React.MouseEvent<Element, MouseEvent>){
            event.preventDefault();
            event.stopPropagation();
            toggleVal = !toggleState.stateVariable;
            toggleState.setState(toggleVal);
            setLoginStyle(toggleVal);
            setSignUpStyle(toggleVal);
          }
      
    const appThemeContext = useContext(themeContext);
            
            let loginStyle: CSSProperties = setLoginStyle(toggleState.stateVariable);
            let signUpStyle: CSSProperties = setSignUpStyle(toggleState.stateVariable);
         const loginText = (<p>Log-in</p>);
                const signUpText = (<p>Sign up</p>);        

          return(
            <>      

                    <ToggleButton cssClassName="login-toggle-button"  children={loginText} style={loginStyle} isDisabled={toggleState.stateVariable} onClick={handleClick}></ToggleButton>
                    <ToggleButton cssClassName="sign-up-toggle-button" children={signUpText} style={signUpStyle} isDisabled={!toggleState.stateVariable} onClick={handleClick}></ToggleButton>
            </>
          )       


    function setSignUpStyle(toggleState:boolean): CSSProperties {
        return (!toggleState) ? {
              backgroundColor: appThemeContext.focusedContentColor,
            color: appThemeContext.focusedContrastColor,
            textDecoration: `double underline ${appThemeContext.focusedBackgroundColor}`
        } : {
              backgroundColor: appThemeContext.focusedBackgroundColor,
            color: appThemeContext.focusedContrastColor,
        };
    }

    function setLoginStyle(toggleState :boolean): CSSProperties {
        return (toggleState) ? {
            backgroundColor: appThemeContext.focusedContentColor,
            color: appThemeContext.focusedContrastColor,
            textDecoration: `double underline ${appThemeContext.focusedBackgroundColor}`
        } : {
             backgroundColor: appThemeContext.focusedBackgroundColor,
            color: appThemeContext.focusedContrastColor,
        };
    }
}
