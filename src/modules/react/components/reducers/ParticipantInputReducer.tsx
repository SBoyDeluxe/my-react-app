import { useReducer } from "react";

  export type ParticipantInputData = {

    username: string,
    userType: string[]
};
export type ClientInputData = {

    username: string
};
  export function useParticipantReducer(){

    let projectManagers: ParticipantInputData[] = [{ username: "", userType: [""] }];
        let projectDevelopers: ParticipantInputData[] = [{ username: "", userType: [""] }];
        let projectClients: ClientInputData[] = [{ username: "" }];

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
}, action : {type : string, payload :any}       ){

    switch (action.type) {
        case "ADD_MANAGER_INPUT_DATA":{

            

                    return({
                        ...participantsState.projectManagers.concat(action.payload),
                        ...participantsState,
                        
                    });
            


        }
            
            break;
                 case "ADD_MANAGER_USER_TYPE":{

            
                    const managerToAddTypeTo = participantsState.projectManagers.filter((manager, index)=>manager.username === action.payload.username)[0];
                   const newUserTypeArray = managerToAddTypeTo.userType.concat(action.payload.userType);
                  
                    return({
                        ...participantsState,
             ...participantsState.projectManagers.filter((dev)=>dev.username!==action.payload.username).concat({username : action.payload.username, userType : newUserTypeArray})
                    });
            


        }
            
            break;
        case "ADD_DEVELOPER_INPUT_DATA":{

            

                    return({
                        ...participantsState,
                        ...participantsState.projectDevelopers.concat(action.payload)
                    });
            


        }
            
            break;
        case "ADD_DEVELOPER_USER_TYPE":{

            
                    let developerToAddTypeTo = participantsState.projectDevelopers.filter((dev, index)=>dev.username === action.payload.username)[0];
                   const newUserTypeArray = developerToAddTypeTo.userType.concat(action.payload.userType);
                  
                    return({
                        ...participantsState,
             ...participantsState.projectDevelopers.filter((dev)=>dev.username!==action.payload.username).concat({username : action.payload.username, userType : newUserTypeArray})
                    });
          


        }
            
            break;
        case "ADD_CLIENT_INPUT_DATA":{

            

                    return({
                        ...participantsState,
                        ...participantsState.projectClients.concat(action.payload)
                    });
            


        }
            
            break;
        case "REMOVE_MANAGER_INPUT_DATA":{

            

                    return({
                        ...participantsState.projectManagers.filter((manager)=>(manager.username!==action.payload.username)),
                        ...participantsState,
                        
         });
            


        }
            
            break;
        case "REMOVE_DEVELOPER_INPUT_DATA":{

            

                     return({
                        ...participantsState.projectDevelopers.filter((developer)=>(developer.username!==action.payload.username)),
                        ...participantsState,
                        
         });
            


        }
            
            break;
        case "REMOVE_CLIENT_INPUT_DATA":{

            

                    return({
                        ...participantsState,
                        ...participantsState.projectClients.filter((client)=>(client.username!==action.payload.username)),
                    });
            


        }
            
            break;
    
        default:
            return participantsState;
            break;
    }
}