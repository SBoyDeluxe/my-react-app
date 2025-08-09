import Color from 'colorjs.io';
import { Theme, ThemeValues } from "../../theme";
import { State } from "./App";
import React, { BaseSyntheticEvent, ChangeEventHandler, EventHandler, InputEventHandler, SyntheticEvent, useContext, useMemo, useState } from "react";
import { Background } from "./background";
import { themeContext } from "../context/ThemeContext";
import { Input } from "./Input";
import { Form } from './Form';
import { Button } from './Button';
export type ThemeSelectorProps = {

   
    themeState : State<ThemeValues>


};
/*
/*
 * Draws a theme selector, where one can generate their own theme or pick one of three standard ones.
 * 
 */
export function ThemeSelector({themeState}:ThemeSelectorProps){
    const appThemeContext = useContext(themeContext);
    let themeVal : string = useMemo(()=>appThemeContext.primaryBackgroundColor, [themeState.stateVariable]);
    


    const [genStratSelect, setGenstrat] = useState(0);
    const  [lightnessPreferenceSelect, setLightnessPreference] = useState(0);


    function handleInput(event : (React.ChangeEvent<HTMLInputElement>)){
       event.stopPropagation();
       
      
            
            if(event.target.value){
                console.log(event.target.value);
                const themeVals = Theme.generateTheme([new Color(event.target.value)], genStratSelect, lightnessPreferenceSelect);
               themeState.setState(themeVals);
            }
    
       //
    };

   

    return(

        
<Background key={window.crypto.randomUUID()} backgroundColor={appThemeContext.tertiaryBackgroundColor} cssClassName="theme-selector-container" >
    <Form key={window.crypto.randomUUID()} onSubmit={()=>console.log("sub")} cssClassName={''}>
        <label key={window.crypto.randomUUID()} htmlFor="generation-strategy-select">Theme-generation settings:</label>
        <select key={window.crypto.randomUUID()}onChange={(e)=>setGenstrat(+e.target.value)} title="Color-selection for theme" name="generation-strategy-select" id="generation-strategy">
          <option value="0">Mono-chromatic</option>
          <option value="1">Analagous</option>
          <option value="2">Complementary</option>
          <option value="3">Triadic</option>
          <option value="4">Compound</option>
        </select>
         <label key={window.crypto.randomUUID()} htmlFor="lightness-preference-select">Theme-lightness settings:</label>
        <select key={window.crypto.randomUUID()} onChange={(e)=>setLightnessPreference(+e.target.value)} title="Lightness-setting-selection for theme" name="lightness-setting-select" id="lightness-setting">
          <option value="0">Dark</option>
          <option value="1">Medium </option>
          <option value="2">Light</option>
        </select>

        <Input key={window.crypto.randomUUID()}  name="color-selection"  cssClassName="color-select" inputType="color" inputState={themeVal} labelName="Color-selection" onEvent={handleInput}  ></Input>
        
</Form>
</Background>

    );


}
