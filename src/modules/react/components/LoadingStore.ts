import React from "react";
import { User } from "../../User";


let isLoading : boolean = false;

let listeners: any[] = [];

 function emitChange(){
  for (let listener  of listeners) {
    listener();
  }
};

export function useLoadingStore(){

       const loadingStore :boolean= React.useSyncExternalStore(LoadingStore.subscribe, LoadingStore.getSnapshotIsLoading);
       return loadingStore;

};



export const LoadingStore = {
    updateLoading() {
        isLoading = !isLoading;
        emitChange();
    },
    
     subscribe(listener: any) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    }},

       getSnapshotIsLoading(){
    
    
        return isLoading;
    
  },

};