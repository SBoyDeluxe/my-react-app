import { useReducer } from "react";
import { Feature } from "../../../feature";



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
 *      action.payload.devTasks : Task[];
 *      
 *      action.payload.featureIndex : number | null
 *              
 *      }
 * 
 * @param features 
 * @param action 
 */
export function FeatureReducer(features: Feature[] | null, action: { type: string, payload: any }) {
    //Checks whether the feature array has been instantiated
    const featuresAreInstantiated = (features !== null);

    let returnArray : Feature[]|null =null;

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

                if (action.payload.featureIndex !== null) {
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
                    else{
                        returnArray = null;
                    }
                }




            }
            else {
                returnArray = null;
            }
        }
            break;
        case "COMPLETE_FEATURE" :   {
            //We can only complete any features if they have been instantiated
            if(featuresAreInstantiated){

                //If featureIndex is given this is a prioritized for filtering

                if(action.payload.featureIndex){
                    const index = action.payload.featureIndex;
                    const featureToComplete = features[index];
                    const completedFeature = featureToComplete.completeFeature();

                    const returnElement = (features.length > 1) ? [features[index] = featureToComplete, ...features] : [completedFeature] ;
                     returnArray = returnElement;
                }else{


                      const featureToComplete = features.filter((feature) => (feature.title === action.payload.title && feature.description === action.payload.description &&
                            feature.type === action.payload.type))[0];

                            if(featureToComplete !== undefined){
                                featureToComplete.completeFeature();
                                returnArray = [ features[index] = featureToComplete, ...features]


                            }


                }

                

                


            }
          

        
        }
        break;

        case "ADD_DEVELOPMENT_TASKS" : {

            if(featuresAreInstantiated){
                    
                //If featureIndex is given this is a prioritized for filtering

                if(action.payload.featureIndex){
                    const index = action.payload.featureIndex;
                    const featureToAddDevTaskTo = features[index];
                    featureToAddDevTaskTo.addDevelopmentTasks(action.payload.devTasks);


                    const returnElement = (features.length > 1) ? [features[index] = featureToAddDevTaskTo, ...features] : [featureToAddDevTaskTo] ;
                    returnArray = returnElement;
                }else{


                      const featureToaddDevTasksTo = features.filter((feature) => (feature.title === action.payload.title && feature.description === action.payload.description &&
                            feature.type === action.payload.type))[0];

                            if(featureToaddDevTasksTo !== undefined){
                                featureToaddDevTasksTo.addDevelopmentTasks(action.payload.devTasks);
                              returnArray =  features.filter((feature,index)=> !(feature.title === action.payload.title && feature.description === action.payload.description &&
                            feature.type === action.payload.type)).concat(featureToaddDevTasksTo);


                            }


                }

            }

        }
        break;
        
        default : returnArray = features;
        break;







    }

    return returnArray;



}