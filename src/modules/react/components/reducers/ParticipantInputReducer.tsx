import { useReducer } from "react";
import { UserStore } from "../../store/UserStore";

export type ParticipantInputData = {

    username: string,
    userType: string[],
    userId : number
};
export type ClientInputData = {

    username: string,
    userId : number
};
export function useParticipantReducer() {

    let projectManagers: ParticipantInputData[] = [{ username: "", userType: [""] }];
    let projectDevelopers: ParticipantInputData[] = [{ username: "", userType: [""], userId:-1 }];
    let projectClients: ClientInputData[] = [{ username: "", userId:-1 }];
     //The creating user is implicitly manager of the project 
    const loggedInUser = UserStore.getSnapshotUser();
    projectManagers[0] = { username: loggedInUser?.username.username!, userType: ["Creator"],userId: loggedInUser?.authParameters.userId!  };

    const initState = {
        projectManagers,
        projectDevelopers,
        projectClients
    };

    return useReducer(ParticipantInputReducer, initState);
}

function ParticipantInputReducer(participantsState: {
    projectManagers: ParticipantInputData[],
    projectDevelopers: ParticipantInputData[],
    projectClients: ClientInputData[],
}, action: { type: string, payload: any }) {
    const projectDevelopersIsUninitiated = participantsState.projectDevelopers[0].userType[0] === "" && participantsState.projectDevelopers[0].username === "";
    let initClauseRan = false;
    const projectClientsIsUninitiated = participantsState.projectClients[0].username === "";
    let returnsState :  {
    projectManagers: ParticipantInputData[];
    projectDevelopers: ParticipantInputData[];
    projectClients: ClientInputData[];
};
    //Check so that we have values in our arrays
    if ( (projectClientsIsUninitiated ) && ( action.type==="ADD_CLIENT_INPUT_DATA")) 
        {
   
           
            let clients =  [ action.payload]
            
            return ({...participantsState,
                    projectClients: clients
            });
           
    
    } 
    else if(projectDevelopersIsUninitiated && action.type==="ADD_DEVELOPER_INPUT_DATA" ){

        let developerEntry;
         if (action.payload.userType) {
                developerEntry = [action.payload]
            } else {
                developerEntry = [{ username: action.payload.username, userType: [" "], userId : action.payload.userId }]

            }
            return ({
                ...participantsState,
                projectDevelopers:developerEntry
            })
    }
    else{
    


    switch (action.type) {
        case "ADD_MANAGER_INPUT_DATA": {

             const userTypeVar =   (action.payload.userType) ? action.payload.userType : [""];
            let newState = ({
                ...participantsState,
                projectManagers: participantsState.projectManagers.concat({username:action.payload.username, userType:userTypeVar, userId:action.payload.userId}),
                

            });

            return newState;



        }

            break;
        case "ADD_MANAGER_USER_TYPE": {


            const managerToAddTypeTo = participantsState.projectManagers.filter((manager, index) => manager.username === action.payload.username)[0];
            //We only want to run the rest if and only if a manager with the username is found
            if (managerToAddTypeTo) {
                const newUserTypeArray = managerToAddTypeTo.userType.concat(action.payload.userType);

                return ({
                    ...participantsState,
                   projectManagers: participantsState.projectManagers.filter((dev) => dev.username !== action.payload.username).concat({...managerToAddTypeTo,  userType: newUserTypeArray })
                });
            }
            else {
                return participantsState;
            }



        }

            break;
        case "REMOVE_MANAGER_USER_TYPE": {
            
           
            const managerToRemoveTypeTo = participantsState.projectManagers.filter((manager, index) => manager.username === action.payload.username)[0];
            if(managerToRemoveTypeTo){
            const newUserTypeArray = managerToRemoveTypeTo.userType.filter((userType) => userType !== action.payload.userType);

            return ({
                ...participantsState,
               projectManagers:participantsState.projectManagers.filter((dev) => dev.username !== action.payload.username).concat({...managerToRemoveTypeTo, username: action.payload.username, userType: newUserTypeArray })
            });}
            else{
                    return {   ...participantsState}
            }
     


        }

            break;
        case "ADD_DEVELOPER_INPUT_DATA": {

                   const userTypeVar =   (action.payload.userType) ? action.payload.userType : [""];

            return ({
                ...participantsState,
                projectDevelopers: participantsState.projectDevelopers.concat({username:action.payload.username, userType:userTypeVar, userId:action.payload.userId })
            });



        }

            break;
        case "ADD_DEVELOPER_USER_TYPE": {


            let developerToAddTypeTo = participantsState.projectDevelopers.filter((dev, index) => dev.username === action.payload.username)[0];
            if(developerToAddTypeTo){
            const newUserTypeArray = developerToAddTypeTo.userType.concat(action.payload.userType);

            return ({
                ...participantsState,
               projectDevelopers: participantsState.projectDevelopers.filter((dev) => dev.username !== action.payload.username).concat({ ...developerToAddTypeTo, userType:newUserTypeArray})
            });

        }else{

            return participantsState;
        }

        }

            break;
        case "REMOVE_DEVELOPER_USER_TYPE": {

            


            let developerToRemoveTypeTo = participantsState.projectDevelopers.filter((dev, index) => dev.username === action.payload.username)[0];
            if(developerToRemoveTypeTo){
            const newUserTypeArray = developerToRemoveTypeTo.userType.filter((userType) => userType !== action.payload.userType);

            return ({
                ...participantsState,
                projectDevelopers: participantsState.projectDevelopers.filter((dev) => dev.username !== action.payload.username).concat({ ...developerToRemoveTypeTo, userType: newUserTypeArray })
            });

        } else{
            return {...participantsState};
        }

        }

            break;
        case "ADD_CLIENT_INPUT_DATA": {



            return ({
                ...participantsState,
                projectClients: participantsState.projectClients.concat(action.payload)
            });



        }

            break;
        case "REMOVE_MANAGER_INPUT_DATA": {

            //A project must always have at least one manager
            if(participantsState.projectManagers.length>1){
            return ({
               
                ...participantsState,
                 projectManagers: participantsState.projectManagers.filter((manager) => (manager.username !== action.payload.username)),

            });
            }else{
                return {...participantsState}
            }
            


        }

            break;
        case "REMOVE_DEVELOPER_INPUT_DATA": {
                let returnState: {
    projectManagers: ParticipantInputData[];
    projectDevelopers: ParticipantInputData[];
    projectClients: ClientInputData[];
};
            if(participantsState.projectDevelopers.length === 1){

                        let projectDevelopers: ParticipantInputData[] = [{ username: "", userType: [""], userId : -1}];
                        returnState =({
                            ...participantsState,
                            projectDevelopers: projectDevelopers
                        })  
            }else{

            returnState = ({
              
                ...participantsState,
                projectDevelopers: participantsState.projectDevelopers.filter((developer) => (developer.username !== action.payload.username)),

            });}


                return returnState
        }

            break;
        case "REMOVE_CLIENT_INPUT_DATA": {

            if(participantsState.projectClients.length ===1){
                 let projectClients: ClientInputData[] = [{ username: "", userId : -1 }];
                        return({
                            ...participantsState,
                            projectClients: projectClients
                        })    
            }else{

            return ({
                ...participantsState,
                projectClients:participantsState.projectClients.filter((client) => (client.username !== action.payload.username)),
            });
        }



        }

            break;

    


        default:
            return {...participantsState};
            break;
    }
}   
}