import Color from "colorjs.io";
import { Theme, ThemeValues } from "../../theme";
import { subscribe } from "diagnostics_channel";
import { createContext, useContext, useSyncExternalStore } from "react";

type ThemeState = {

    mainColor : string, 
    genStrat : number,
    lightPref : number
}

let themeState = {
    mainColor : "#a9bbbd9f",
    genstrat : 0,
    lightPref : 0
}
let theme : ThemeValues = Theme.generateTheme([new Color("#a9bbbd9f")], 0, 0); 
//let isLoading : boolean = false;
let listeners: any[] = [];

export let themeContext = createContext<ThemeValues>(theme);

export function useThemeStore(){

    return useSyncExternalStore(ThemeStore.subscribe, ThemeStore.getSnapshotTheme);
}

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
};

export const  ThemeStore = {

    getSnapshotTheme(){
        return theme;
    },

     subscribe(listener: any) {
    listeners = [...listeners, listener];

    return () => {
      listeners = listeners.filter(l => l !== listener);
    }

    
},
setTheme({mainColor, genStrat, lightPref}:ThemeState){

       theme = Theme.generateTheme([new Color(mainColor)], genStrat, lightPref);
       emitChange();


       
        
    } 




}