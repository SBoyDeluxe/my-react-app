import { useSyncExternalStore } from "react";
import { User } from "../../User";
import { UserStore } from "../store/UserStore";


export type ProjectsTabProp = {
    /**
     * 
     */
    projectList : string[],
    
}

export function ProjectsTab(){

    const userStore = useSyncExternalStore(UserStore.subscribe, UserStore.getSnapshotUser);

    const mailBox = userStore?.mailbox;

}