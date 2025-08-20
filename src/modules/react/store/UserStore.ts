import React, { createContext, useSyncExternalStore } from "react";
import { FirebaseAPIClient } from "../../firebaseapiClient";
import { User } from "../../User";
import { LoadingStore } from "../components/LoadingStore";
import { CryptoUtilObject } from "../../Cryptography_Util";
import { useNavigate } from "react-router";
import { MailContent } from "../../mailbox";
import { Project } from "../../project";


export const firebaseClient = new FirebaseAPIClient();
//Done here so that the whole app uses the same client
export const firebaseClientContext = createContext<FirebaseAPIClient>(firebaseClient);
let user: User | null = null;
let projects : Project[]|null = null; 
//let isLoading : boolean = false;
let listernMailboxStore: any[] = [];
let listernersUserStore: any[] = [];
let listenerProjectStore : any[] = [];




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
function emitChangeProjectStore() {
  for (let listener of listenerProjectStore) {
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
  async logOut() {
    LoadingStore.updateLoading();

    await firebaseClient.logOut().then(()=>{
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


 export const MailboxStore = {

  subscribe(listener: any) {
    listernMailboxStore = [...listernMailboxStore, listener];
    return () => {
      listernMailboxStore = listernMailboxStore.filter(l => l !== listener);
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


export const ProjectStore = {

  subscribe(listener: any) {
    listenerProjectStore = [...listenerProjectStore, listener];
    return () => {
      listenerProjectStore = listenerProjectStore.filter(l => l !== listener);
    }
  },

   getSnapshotProjects(){
    return projects;

    
  },

  getProjects(){

    const projectInvites = user?.mailbox.getProjectInvites();
    
    if(projectInvites !== undefined){
      LoadingStore.updateLoading();

    const promises =  projectInvites?.map((invite)=>firebaseClient.readProject({projectIndex:invite.projectIndex, projectKey:invite.webKey}));
      Promise.all(promises).then((projectVals)=>{
        
        projects =projectVals;
        console.log(projectVals);
        console.log(projects);
      LoadingStore.updateLoading();
      });
      

    }
  },

   async updateProject(projectToUpdate : Project) : Promise<void>{

      const projectKeyObject = await projectToUpdate.projectKeyObject;

      LoadingStore.updateLoading();
      try {
       
      firebaseClient.updateProject(projectToUpdate, projectKeyObject).then((val)=>{

        LoadingStore.updateLoading();
        console.log(val);
        alert(`${projectToUpdate.title} was successfully updated!`);

      }); 
      } catch (error : unknown) {

        if(error instanceof Error){
        alert(error.message);
        LoadingStore.updateLoading();
        }
      }
  }


}








