import React, { useSyncExternalStore } from "react";
import { FirebaseAPIClient } from "../../firebaseapiClient";
import { User } from "../../User";
import { LoadingStore } from "../components/LoadingStore";
import { CryptoUtilObject } from "../../Cryptography_Util";
import { useNavigate } from "react-router";


export const firebaseClient = new FirebaseAPIClient();
let user : User|null = null;
//let isLoading : boolean = false;
let listeners: any[] = [];



 function emitChange(){
  for (let listener  of listeners) {
    listener();
  }
};

export function useUserStore(){

       const userStore : User|null = React.useSyncExternalStore(UserStore.subscribe, UserStore.getSnapshotUser);
       return userStore;

};

export function useMailboxContentStore(){

  const   mailStore :string[] | undefined  = React.useSyncExternalStore(UserStore.subscribe, UserStore.getSnapshotMailbox);
  return mailStore;
}


export const UserStore ={

   

    signUpUser(username : string, password : string){


       LoadingStore.updateLoading();
     firebaseClient.signUp(username, password).then((newUser)=>{
      LoadingStore.updateLoading();
        user = newUser;
        emitChange();
        return(user === newUser);

      });
        

    },
    async login(username : string, password : string){
      LoadingStore.updateLoading();
     firebaseClient.loginUser(username, password).then((newUser)=>{
      LoadingStore.updateLoading();
        user = newUser;
        emitChange();
        return(user === newUser);

      });
     
    },
    logOut(){

        firebaseClient.logOut();
        user = null;
        emitChange();
    },
     subscribe(listener: any) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    }},
       getSnapshotUser(){
       
    return user;
    
  },

  getSnapshotMailbox(){

   return user?.mailbox.contents;
  }
}








