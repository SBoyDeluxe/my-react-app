import React, { createContext, useSyncExternalStore } from "react";
import { FirebaseAPIClient } from "../../firebaseapiClient";
import { User } from "../../User";
import { LoadingStore } from "../components/LoadingStore";
import { CryptoUtilObject } from "../../Cryptography_Util";
import { useNavigate } from "react-router";
import { MailContent } from "../../mailbox";


export const firebaseClient = new FirebaseAPIClient();
//Done here so that the whole app uses the same client
export const firebaseClientContext = createContext<FirebaseAPIClient>(firebaseClient);
let user: User | null = null;
//let isLoading : boolean = false;
let listernMailboxStore: any[] = [];
let listernersUserStore: any[] = [];



function emitChangeUser() {
  for (let listener of listernersUserStore) {
    listener();
  }
};
function emitChangeMailbox() {
  for (let listener of listernMailboxStore) {
    listener();
  }
};

export function useUserStore() {

  const userStore: User | null = React.useSyncExternalStore(UserStore.subscribe, UserStore.getSnapshotUser);
  return userStore;

};

export function useMailboxContentStore() {

  const mailStore: string[] | undefined = React.useSyncExternalStore(Mail, UserStore.getSnapshotMailbox);
  return mailStore;
}


export const UserStore = {



  signUpUser(username: string, password: string) {


    LoadingStore.updateLoading();
    firebaseClient.signUp(username, password).then((newUser) => {
      LoadingStore.updateLoading();
     user = newUser;
      emitChangeUser();
     

    });


  },
  async login(username: string, password: string) {
    LoadingStore.updateLoading();
    firebaseClient.loginUser(username, password).then((newUser) => {
      LoadingStore.updateLoading();
      user = newUser;
      emitChangeUser();
     

    });

  },
  logOut() {
    LoadingStore.updateLoading();

    firebaseClient.logOut().then(()=>{
          LoadingStore.updateLoading();

      user = null;
    emitChangeUser();
    });
    
  },
  subscribe(listener: any) {
    listernersUserStore = [...listernersUserStore, listener];
    return () => {
      listernersUserStore = listernersUserStore.filter(l => l !== listener);
    }
  },
  getSnapshotUser() {

    return user;

  }


}


const MailboxStore = {

  subscribe(listener: any) {
    listernersUserStore = [...listernersUserStore, listener];
    return () => {
      listernersUserStore = listernersUserStore.filter(l => l !== listener);
    }
  },
  getSnapshotMailbox() {

    return user?.mailbox.contents;
  },

  async sendMail(userIds : number[], mailContent : MailContent){
    LoadingStore.updateLoading();
    const mailComplete :Promise<void>[] = userIds.map((userId, index)=>{

       return firebaseClient.sendMail(userId, mailContent).catch((error : Error)=>alert(error.message));
    });

    await Promise.allSettled(mailComplete).then(()=>{

      LoadingStore.updateLoading();
      alert("Message(s) sent!");
    });

  }




}








