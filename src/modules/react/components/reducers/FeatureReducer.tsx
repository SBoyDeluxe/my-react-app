import { useReducer } from "react";
import { Feature } from "../../../feature";
import { Task } from "../../../Task";



function useFeatureReducer() {
    const features: Feature[] | null = null;

    return useReducer(FeatureReducer, features);



}

/**
 * 
 * @example
 * 
 *      //----!!All filters will be done with the assumption that title, type and 
 *      //description can be used as discerning data for any 1 feature if featureIndex is null !!----
 *           
 *      //Can always be called, instantiates a Feature[] if none exists
 *     action.type : ADD_FEATURE {
 *          action.payload.title : string,
 *          action.payload.type : string,
 *          action.payload.description : string,
 *          //timeconstraints must be given for a feature
 *          action.payload.timeconstraints : TimeConstraints,
 *          //if developmentTasks are left as null, the first dev-task becomes "Plan project" with all assigned devs assigned to it
 *          action.payload.developmentTasks : Task[]|null,
 *          action.payload.assignedDevelopers : Developer[] | null,
 *         
 *              
 *      }
 * 
 *      //Can only be called on an instantiated feature array
 *     action.type : ASSIGN_DEVELOPERS {
 *      action.payload.title : string,
 *      action.payload.type : string,
 *      action.payload.description : string,
 *      action.payload.developersToAssign : Developer[] | null,
 *      action.payload.featureIndex : number | null
 *              
 *      }
 *      //Can only be called on an instantiated feature array
 *     action.type : COMPLETE_FEATURE {
 *      action.payload.title : string,
 *      action.payload.type : string,
 *      action.payload.description : string,
 *      action.payload.featureIndex : number | null
 *              
 *      }
 *      //Can only be called on an instantiated feature array
 *     action.type : ADD_DEVELOPMENT_TASKS {
 *      action.payload.title : string,
 *      action.payload.type : string,
 *      action.payload.description : string,
 *      action.payload.devTask : Task;
 *      
 *      action.payload.featureIndex : number | null
 *              
 *      }
 * 
 *  action.type : "CHANGE_DEV_TASK_STATUS": {
 *
 *           
 *               
 *               
 *               action.payload.devTaskIndex : number;
 *
 *               action.payload.featureIndex : number;
 *
 *               action.payload.newStatus :string ;
 *      }
 * 
 * @param features 
 * @param action 
 */
export function FeatureReducer(features: Feature[] | null, action: { type: string, payload: any }) {
    //Checks whether the feature array has been instantiated
    const featuresAreInstantiated = (features !== null);

    let returnArray: Feature[] | null = null;

    switch (action.type) {

        case "ADD_FEATURE": {

            if (featuresAreInstantiated) {
                const featureToAdd = new Feature(action.payload.title, action.payload.type, action.payload.description, action.payload.timeconstraints, action.payload.developmentTasks, action.payload.assignedDevelopers);

                const newFeatureArray = features.concat(featureToAdd);

                returnArray = newFeatureArray;
            } else {
                const featureToAdd = new Feature(action.payload.title, action.payload.type, action.payload.description, action.payload.timeconstraints, action.payload.developmentTasks, action.payload.assignedDevelopers);

                returnArray = [featureToAdd];

            }

        }
            break;

        case "ASSIGN_DEVELOPERS": {
            //Only if features are instantiated can we assign developers to those features
            if (featuresAreInstantiated) {

                if (action.payload.featureIndex !== undefined) {
                    const index = action.payload.featureIndex;

                    let featureToAssignDevsTo = features[index];
                    featureToAssignDevsTo.assignDevelopers(action.payload.developersToAssign, null);

                    const arrayOfOtherFeatures = features.filter((feature) => !(feature.title === action.payload.title && feature.description === action.payload.description &&
                        feature.type === action.payload.type));

                    const newFeatureArray = (features.length > 1) ? (arrayOfOtherFeatures.concat(featureToAssignDevsTo)) : [featureToAssignDevsTo];

                    returnArray = newFeatureArray;
                } else {

                    const featureToAssignDevsTo = features.filter((feature) => (feature.title === action.payload.title && feature.description === action.payload.description &&
                        feature.type === action.payload.type));

                    if (featureToAssignDevsTo[0] !== undefined) {
                        featureToAssignDevsTo[0].assignDevelopers(action.payload.developersToAssign, null);

                        const arrayOfOtherFeatures = features.filter((feature) => !(feature.title === action.payload.title && feature.description === action.payload.description &&
                            feature.type === action.payload.type));

                        const newFeatureArray = (features.length > 1) ? (arrayOfOtherFeatures.concat(featureToAssignDevsTo[0])) : [featureToAssignDevsTo[0]];

                        returnArray = newFeatureArray;

                    }
                    else {
                        returnArray = null;
                    }
                }




            }
            else {
                returnArray = null;
            }
        }
            break;
        case "COMPLETE_FEATURE": {
            //We can only complete any features if they have been instantiated
            if (featuresAreInstantiated) {

                //If featureIndex is given this is a prioritized for filtering

                if (action.payload.featureIndex !== undefined) {
                    const index = action.payload.featureIndex;
                    const featureToComplete = features[index];
                    const completedFeature = featureToComplete.completeFeature();

                    const returnElement = (features.length > 1) ? [features[index] = featureToComplete, ...features] : [completedFeature];
                    returnArray = returnElement;
                } else {


                    const featureToComplete = features.filter((feature) => (feature.title === action.payload.title && feature.description === action.payload.description &&
                        feature.type === action.payload.type))[0];
                    const restOfTheFeatures = features.filter((feature) => !(feature.title === action.payload.title && feature.description === action.payload.description &&
                        feature.type === action.payload.type));

                    if (featureToComplete !== undefined) {
                        featureToComplete.completeFeature();
                        returnArray = [...restOfTheFeatures, featureToComplete]


                    }


                }






            }



        }
            break;

        case "ADD_DEVELOPMENT_TASKS": {

            if (featuresAreInstantiated) {

                //If featureIndex is given this is a prioritized for filtering

                if (typeof action.payload.featureIndex === "number") {
                    const index = action.payload.featureIndex;
                    let featureToAddDevTaskTo = features[index];
                    const devTaskToAdd = action.payload.devTask;
                    let currentDevTasks = featureToAddDevTaskTo.developmentTasks;
                    //Add our new devTask to the array
                    const newDevTaskArray = (typeof currentDevTasks?.length !== "undefined") ? currentDevTasks.concat(devTaskToAdd): [devTaskToAdd];
                    //Add the new task array to our feature object

                    featureToAddDevTaskTo.developmentTasks = newDevTaskArray;

                    returnArray = features.filter((feature, arrayIndex) => (arrayIndex !== index)).concat(featureToAddDevTaskTo);
                } else {


                    let featureToaddDevTasksTo = features.filter((feature) => (feature.title === action.payload.title && feature.description === action.payload.description &&
                        feature.type === action.payload.type))[0];

                    if (typeof featureToaddDevTasksTo !== "undefined") {
                        const devTaskToAdd = action.payload.devTask;
                        let currentDevTasks = featureToaddDevTasksTo.developmentTasks;
                        //Add our new devTask to the array
                        const newDevTaskArray = (typeof currentDevTasks !== "undefined") ? currentDevTasks.concat(devTaskToAdd): [devTaskToAdd];
                        featureToaddDevTasksTo.developmentTasks = newDevTaskArray;
                        returnArray = features.filter((feature, index) => !(feature.title === action.payload.title && feature.description === action.payload.description &&
                            feature.type === action.payload.type)).concat(featureToaddDevTasksTo);


                    }


                }

            }

        }
            break;

        case "CHANGE_DEV_TASK_STATUS": {

            if (featuresAreInstantiated) {
                //Obtain index of feature and devTask from payload

                const devTaskIndex = action.payload.devTaskIndex;

                const featureIndex = action.payload.featureIndex;

                const newStatus = action.payload.newStatus;

                if (newStatus === "Complete") {
                    let featureToCompleteTaskIn = features.filter((feat, featIndex)=>(featIndex === featureIndex))[0];
                    
                    featureToCompleteTaskIn.developmentTasks![devTaskIndex].completeTask();

                    returnArray = features.filter((feat, featindex)=>(featindex !== featureIndex)).concat(featureToCompleteTaskIn);
                }
                else {

                    let featureToSetStatusForTaskIn = features.filter((feat, featIndex)=>(featIndex === featureIndex))[0];
                    
                    featureToSetStatusForTaskIn.developmentTasks![devTaskIndex].currentTaskStatus = newStatus;

                    returnArray = features.filter((feat, featindex)=>(featindex !== featureIndex)).concat(featureToSetStatusForTaskIn);                }
               
            }

        }
        break;

        default: returnArray = features;
            break;







    }

    return returnArray;



}