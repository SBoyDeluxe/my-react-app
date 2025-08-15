import Color from 'colorjs.io';
import { Theme, ThemeValues } from "../../theme";
import { State } from "./App";
import React, { BaseSyntheticEvent, ChangeEvent, ChangeEventHandler, EventHandler, InputEventHandler, SyntheticEvent, useContext, useMemo, useState } from "react";
import { Background } from "./background";
import { themeContext, ThemeStore, useThemeStore } from "../store/ThemeStore";
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
    let themeVal = useThemeStore();
    


    const [genStratSelect, setGenstrat] = useState(0);
    const  [lightnessPreferenceSelect, setLightnessPreference] = useState(0);


    function handleInput(e: React.FormEvent<HTMLInputElement>){
       
      
            
          ThemeStore.setTheme({mainColor : e.target.value, genStrat : genStratSelect, lightPref : lightnessPreferenceSelect})
    
       //
    };

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){

       
      
            
          ThemeStore.setTheme({mainColor : e.target.value, genStrat : genStratSelect, lightPref : lightnessPreferenceSelect})
    }



   

    return(

        
<Background  backgroundColor={appThemeContext.tertiaryBackgroundColor} cssClassName="theme-selector-container" >
    <Form  onSubmit={(e)=> e.preventDefault} cssClassName={'theme-select-form'}>
        <label  htmlFor="generation-strategy-select">Theme-generation settings:</label>
        <select onChange={(e)=>setGenstrat(+e.target.value)} title="Color-selection for theme" name="generation-strategy-select" id="generation-strategy">
          <option value="0">Mono-chromatic</option>
          <option value="1">Analagous</option>
          <option value="2">Complementary</option>
          <option value="3">Triadic</option>
          <option value="4">Compound</option>
        </select>
         <label  htmlFor="lightness-preference-select">Theme-lightness settings:</label>
        <select  onChange={(e)=>setLightnessPreference(+e.target.value)} title="Lightness-setting-selection for theme" name="lightness-setting-select" id="lightness-setting">
          <option value="0">Dark</option>
          <option value="1">Medium </option>
          <option value="2">Light</option>
        </select>

        <Input    name="color-selection"  cssClassName="color-select" inputType="color" inputState={themeVal.primaryBackgroundColor} labelName="Color-selection" onEvent={handleChange}  ></Input>
        
</Form>
</Background>

    );


}
