// import { URL } from "url";
// import { FirebaseURLBuilder } from "./firebase_url_builder";
// import { Client, Developer, Manager, User, Username } from "./User";
// import { throws } from "assert";
// import { Project } from "./project";
// import { Feature } from "./feature";
// import { Task } from "./Task";
// import {CryptoUtilObject} from "./Cryptography_Util";




// /**This class handles fetching from the firebase API and interpreting user data flow as well as 
//  * server data flow into the business logic of our Scrumboard application.
//  * Handles CRUD-operations with the firebase api
//  *  -> Uses : BearerTokenProvider and FIrebaseURLProvider 
//  *      in accompolishing api-access
//  */
// export class FirebaseApiClient implements RestApiClient {

//     entityTypes: Array<Object> | null;
//     /**Represents the user instance gotten after verification against {username && pasword}
//  *  inside the /user-table.
//  * 
//  * Before one such user has done a verified login, this is null.
//  *  
//  *  @see {@link FirebaseApiClient} 
//  */
//     userOfClient: User | null;
//     /** Represents an exposure point for results to be saved from the callback function implementation of the interface 
//     * 
//     * @property {Object[]} results : Used for saving results for the user-session
//     * @property {number} numberOfResults : Used to indicate the number of results currently saved in the instance
//     * 
//     * @see |{@linkcode FirebaseApiClient.saveResult|
//     */
//     savedResults: {
//         results: Object[],
//         numberOfResults: number

//     };



//     constructor() {
//         this.entityTypes = [User, Project, Feature, Task];
//         this.userOfClient = null;
//         this.savedResults = {
//             results: new Array(1),
//             numberOfResults: 0
//         }
        


//     }


//     /**
//      * 
//      * 
//      * 
//      * 
//      *  
//      * 
//      *
//      * @param {URL} endpointURL - The endpoint URL, generated with {@linkcode FirebaseURLBuilder} 
//      * @param {Object} instanceToCreate - Should be an object from entityTypes array 
//      * @param {Function} onCreationComplete - The actions we would like to perform on completion
//      * @param {Function} onError - The actions we would like to perform on error
//      * 
//      *  @see | {@link RestApiClient } |
//      */
//     createAtEndpoint(endpointURL: URL, instanceToCreate: Object, onCreationComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Object | void) | null): void {
//         /*Means that user is not logged in*/
//        if(this.userOfClient == null) {
//         /*Means we have a sign-up or assigment - Holds: Client, Manager, Developer */
//             if (instanceToCreate instanceof User) {
            
//             //Get username endpoint as URL
//             signUpUser(instanceToCreate);



//         } //if( instanceToCreate instanceOf User)

        
        
//     } //if(this.userOfClient == null) - Ned of non-logged in
//       //All cases where the userOfClient is a certified User (Manager/Developer/Client)  
//     else{

//      //   let userClientTypeString =  this.userOfClient.userType;

//         // switch (userClientTypeString) {
//         //     //Means a developer is logged in, here in all creation options for developer is found
//         //     case "Developer":
//         //                     if(instanceToCreate instanceof Task){


//         //                     }
//         //                     else{


//         //                     }
//         //             //A developer can be assigned features, where they can create subtasks
                
//         //         break;


//         //     case "Manager":
               
//         //                                         //Means a Manager is logged in, here in all creation options for Manager is found -> Which is create Project
//         //                     //A Manager can create projects, which have features to be completed 
//         //                     // (One such feature could be marketing.videos or login/sign-up) -> This feature then consists of tasks
//         //                     //Which are assigned to developers that can complete and create new substasks within a task. This stratifies the work planning so that 
//         //                     //Manager delegates features to developers that develop these features and have free reins in that development process
//         //                          if(instanceToCreate instanceof Project){
//         //                             //A Manager can create a project, create features and create developTeams for Features


//         //                          }
//         //                          else if( instanceToCreate instanceof Feature){


//         //                          }
//         //         break;

//         //     case "Client":
                        
//         //     //Means a Client is logged in, here in all creation options for Client is found -> Which are none
//         //     //A Client should, in this iteration, just be able to update themselves on projects using the project key
//         //     //and see the progress of their project.  
            
            
//         //         break;
        
//         //     default:
//         //         break;
//         // }


    
//     }//if(this.userOfClient != null) ; The user is a logged in user

    
                   


//         /**
//          * This function takes in a user instance, checks if that user name is available and if and only if
//          * that username is available writes the user data to firebase
//          * 
//          */
//         function signUpUser(instanceToCreate : any) {
//             const usernameUrl = FirebaseURLBuilder.getEndpointURL(FirebaseURLBuilder.tableEndpoints.username);
//             const response = fetch(usernameUrl, FirebaseURLBuilder.generateOptions("GET", null)).then((response) => {
//                 if (response.ok) {

//                     return response.json();
//                 }
//                 else {

//                     throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - FirebaseApiClient, createAtEndpoint with creation type : ${typeof instanceToCreate}`);
//                 }

//             }).then((json) => {
//                 //Check if the username is included in the username list, if not add
//                 //Error thrown on username found 
//                 const updatedUsernameList = CryptoUtilObject.encodeBase64(CryptoUtilObject.encrypt(FirebaseApiClient.concatenateUsernameToUsernameList(json, instanceToCreate.username), null));

//                 //Create the user-entry for the /users endpoint
//                 const userEntity = CryptoUtilObject.encodeBase64(CryptoUtilObject.encrypt(JSON.stringify(instanceToCreate), instanceToCreate["password"]));
//                 //Return the values to be inserted into each table
//                 return [updatedUsernameList, userEntity];

//             }).then((values) => {
//                 const usernameAddRequest = fetch(FirebaseURLBuilder.getEndpointURL(FirebaseURLBuilder.tableEndpoints.username), FirebaseURLBuilder.generateOptions("PUT", values[0])).then((response) => {

//                     if (response.ok) {
//                         return response;
//                     }
//                     else {
//                         throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - FirebaseApiClient, createAtEndpoint :: <usernameAddRequest : Promise> with creation type : ${typeof instanceToCreate}`);
//                     }
//                 }).catch((error) => {
//                     if (onError != null) {

//                         onError(error);
//                     } else {
//                         console.log(error);
//                     }

//                 });
//                 const userAddRequest = fetch(FirebaseURLBuilder.getEndpointURL(FirebaseURLBuilder.tableEndpoints.users), FirebaseURLBuilder.generateOptions("POST", values[1])).then((response) => {

//                     if (response.ok) {
//                         return response;
//                     }
//                     else {
//                         throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - FirebaseApiClient, createAtEndpoint :: <userAddRequest : Promise> with creation type : ${typeof User}`);
//                     }
//                 }).catch((error) => {
//                     if (onError != null) {

//                         onError(error);
//                     } else {
//                         console.log(error);
//                     }

//                 });

//                 return [usernameAddRequest, userAddRequest];



//             }).then((responses) => {

//                 //Run onCreationComplete if such a function is given on the appropriate objects
//                 if (responses[0] instanceof Response) {
//                     if (onCreationComplete != null) {

//                         onCreationComplete(responses[0]);
//                     }


//                 }
//                 if (response[1] instanceof Response) {
//                     if (onCreationComplete != null) {

//                         onCreationComplete(response[1]);
//                     }


//                 }



//             }).catch((error) => {
//                 if (onError != null) {

//                     onError(error);
//                 }
//                 else {
//                     console.log(error);
//                 }
//             });
//         }
//     }
//     /**
//      * Appends the username string to the list if that list doesn´t already include the username ; In that case an Error is thrown
//      * 
//      * 
//      * @param {FirebaseURLBuilder.tableEndpoints.username} json A json from the /username endpoint in the Scrumboard database 
//      * @param {Username} instanceToCreate : The username that we want to append to the username list
//      * @returns {string} The username list with concatenated with the chosen username. All username-entries are prepended with whitespace
//      * @throws {Error} "That username was already taken! Please select another" on already taken username
//      */
//     private static concatenateUsernameToUsernameList(json: any, instanceToCreate: Username): string {

//         if(json){
//         const jsonString = JSON.stringify(json);

//         const utf8JsonString = CryptoUtilObject.decodeBase64(jsonString);

//         const decryptedutf8String = CryptoUtilObject.decrypt(utf8JsonString, null);

//         //If the list of usernames doesn´t include the username we add it to the string
//         if (!decryptedutf8String.includes(instanceToCreate.username)) {

//             //Note that we can split the string on <whitespace> to get all separate instances
//             const updatedUsernameString = decryptedutf8String.concat(` ${instanceToCreate.username}`);
//             return updatedUsernameString;
//         }
//         else {
//             throw new Error("That username was already taken! Please select another");
//         }

//     }
//         //if json doesn´t exist and the response was ok then that must mean it is empty, in that case we create a new list
//     }

//     readAtEndpoint(endpointURL: URL, onReadComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Error | Object | void) | null): void {
//         if (endpointURL.href.includes("/username.json")) {

            

//             const usernameUrl = FirebaseURLBuilder.getEndpointURL(FirebaseURLBuilder.tableEndpoints.username);
//             const response = fetch(usernameUrl, FirebaseURLBuilder.generateOptions("GET", null)).then((response) => {
//                 if (response.ok) {
//                     //If the response is ok we can claim the read was complete ; We call the onReadComplete if != null
//                     if (onReadComplete != null) {
//                         onReadComplete(response);

//                     }
//                     ;
//                     return response.json();
//                 }
//                 else {
//                     ;
//                     throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - FirebaseApiClient, readAtEndpoint-method`);
//                 }

//             }).catch((error) => {
//                 if (onError != null) {

//                     onError(error);
//                 }
//                 else {
//                     console.log(error);
//                 }
//             });

            
//         }


//         /*Means that user is not logged in*/
//         if (this.userOfClient == null) {


//         }
//     }
//     /**
//      * Takes in a sucessful response from the username-endpoint ({@link Response.ok if(response.ok)})
//      * and returns the decrypted username list from the endpoint
//      * 
//      * @param json : The body of the fetch-response ({@link Response})
//      * @borrows {@link FirebaseApiClient.savedResults savedResults} : For long-term memory storage.
//      *  -> {@link Username[]} usernameList : The list of usernames as an array
//      */
//     private onUsernameReadCallback(json: any) {
//         const encryptedUsernameList = CryptoUtilObject.decodeBase64(JSON.stringify(json).valueOf());
//         //Null makes sure we use the app authentication key to decrypt the username list entry
//         const decryptedUsernameList = CryptoUtilObject.decrypt(encryptedUsernameList, null);

//         //We convert the list to a list of usernames by splitting it on whitespace
//         const splitUsernameList = decryptedUsernameList.split(" ");

//         let usernameTypedArray = new Array<Username>(splitUsernameList.length);

//         splitUsernameList.forEach((username, index) => {
//             //Instantiates a list of Username-objects to clarify program specific usage-cases in, for example :
//             // filtering the savedResults.results array
//             usernameTypedArray[index] = new Username(username);
//         });



//         this.saveResult(usernameTypedArray);


//     }
//     /**
//      * Save result into and dynamically resize the {@link FirebaseApiClient.savedResults savedResults.results} array upon need
//      * @param {Object} resultToSave : The result wished to save for long-term storage
//      * @returns {void} 
//      */
//     private saveResult(resultToSave: Object): void {


//         if (Array.isArray(resultToSave)) {

//             //See if there´s space in the current savedResults.results -> .results is instantiated with space for 1 object, so 
//             //reassignment is only needed if numberOfResults > 0 
//             if (this.savedResults.numberOfResults > 0) {
//                 let tempArray = new Array(this.savedResults.numberOfResults + 1);
//                 //Makes sure we don´t lose elements via garbage collection
//                 for (let i = 0; i < this.savedResults.numberOfResults; i++) {
//                     tempArray[i] = this.savedResults.results[i];
//                 }
//                 tempArray[this.savedResults.numberOfResults] = Array.from(resultToSave);
//                 this.savedResults.results = tempArray;
//                 //Once we have assigned the new value to the array we increase the number of results to keep 
//                 //syntax and logic synchronized (not assigning the number of elements before the operations holding
//                 //the logic of the operations are complete)
//                 this.savedResults.numberOfResults++;



//             }
//             else {

//                 this.savedResults.results[0] = Array.from(resultToSave);
//                 this.savedResults.numberOfResults++;

//             }
//         }
//         else {

//             //See if there´s space in the current savedResults.results -> .results is instantiated with space for 1 object, so 
//             //reassignment is only needed if numberOfResults > 0 
//             if (this.savedResults.numberOfResults > 0) {
//                 let tempArray = new Array(this.savedResults.numberOfResults + 1);
//                 //Makes sure we don´t lose elements via garbage collection
//                 for (let i = 0; i < this.savedResults.numberOfResults; i++) {
//                     tempArray[i] = this.savedResults.results[i];
//                 }
//                 tempArray[this.savedResults.numberOfResults] = resultToSave;
//                 this.savedResults.results = tempArray;
//                 //Once we have assigned the new value to the array we increase the number of results to keep 
//                 //syntax and logic synchronized (not assigning the number of elements before the operations holding
//                 //the logic of the operations are complete)
//                 this.savedResults.numberOfResults++;



//             }
//             else {

//                 this.savedResults.results[0] = resultToSave;
//                 this.savedResults.numberOfResults++;

//             }

//         }
//     }

//     updateAtEndpoint(endpointURL: URL, instanceOfEntityType: Object, onUpdateComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Error | Object | void) | null): void {
//             //Updating takes place at a specific endpoint with the PATCH HTTP-method
//             //This makes a PATCH-call to the endpoint specified and with the instanceOfEntityType entered into the body of the request as a JSON.stringify
//             const promise : Promise<void | Boolean> = fetch(endpointURL, FirebaseURLBuilder.generateOptions(FirebaseURLBuilder.httpMethods.PATCH, instanceOfEntityType))
//             .then((response)=>{

//                 //We check if the response was ok or not
//                 if(response.ok){

//                     //response success= true= true;
//                         if(onUpdateComplete!=null){
//                             onUpdateComplete(response);
                        
                        
//                         }


                        
//             }//if(response.ok)


//             //if response is not okay we want to throw that error
//             else{
//                 throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - FirebaseApiClient, updateAtEndpoint-method : Type: ${typeof instanceOfEntityType}`)


//             }//if( NOT (response.ok))
                                                                    

//             }).catch((error)=>{

//                 if(onError != null){

//                     onError(error);
//                 }
//                 else{

//                     console.log("!!!!Error!"+error+ "!!!!!!");
//                 }
//             });


            

//     }
//     deleteAtEndpoint(endpointURL: URL, instanceOfEntityTypeToDelete: Object | Array<Object>, onDeleteComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Error | Object | void) | null): void {

//             fetch(endpointURL, FirebaseURLBuilder.generateOptions(FirebaseURLBuilder.httpMethods.DELETE, instanceOfEntityTypeToDelete))
//             .then((response)=>{

//                 //Check wheteher response was okay or not in fetch - A response is always obtained, its status might not be in 200-299 though
//                     if(response.ok){

//                         if(onDeleteComplete != null){

//                             onDeleteComplete(response);
//                         } // if(onDeleteComplete !=null)


                            
                    
//                     } //if(response.ok)
//                     else{
                                                  
//                         // on response not ok we want to throw an error up the call chain

//                         throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - in FirebaseApiClient, deleteAtEndpoint-function with instanceTypeToDelete ${instanceOfEntityTypeToDelete}`)


//                     }

//             }).catch((error)=>{

//                 if(onError != null){

//                     onError(error);
//                 }
//                 else{

//                     console.log(error);
//                 }
//             });


//     }

//     /**
//      * 
//      * @param authenticate : 
//      * @param  onComplete 
//      * @param onError 
//      * @see {@link BearerTokenProvider}
//      * @see {@link BearerTokenProvider.provideJWT()}
//      */
//     authenticate(authenticate: () => Object | boolean | string, onComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Error | Object | void) | null) {
//         throw new Error("Method not implemented.");
//     }


//     static signUpUser(username: string, password: string, userType) {


//     }
//     /**
//      * Makes a post call to the endpoint : This call acts as a push, and generates a firebase key under which the entrance is stored. 
//      * This call adds an element to the collection of elements in the table at that endpoint ; Doesn´t save over or alter 
//      * 
//      * @param {URL} endpointURL : The URL of the specific database table endpoint
//      * @param {Object} instanceToPost : The insantiated object with the information we wish to post. E.g : User updates username, a new User object is created with that username
//      *  The instance should be a member of the entityTypes-array
//      * @param {Function} onPostComplete : The function to be called when we have received word that the post is actually complete. E.g : Show the new endpoint contents
//      * @param {Function} onError : The function to be called on an error. E.g : Response status not in 200 range, notify the user of the specific error via alert
//      * 
//      * @see  | {@linkcode FirebaseApiClient.entityTypes} | {@linkcode RestApiClient.entityTypes} |
//      */
//     static postToEndpoint(endpointURL: URL, instanceToPost : Object,onPostComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Error | Object | void) | null): void{
//             fetch(endpointURL, FirebaseURLBuilder.generateOptions(FirebaseURLBuilder.httpMethods.POST, instanceToPost))
//             .then((response)=>{

//                 if(response.ok){

//                     if(onPostComplete != null){

//                         onPostComplete(response);
//                     }


//                 }
//                 else{
//                             throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - FirebaseApiClient, postToEndpoint-function with post type : ${typeof instanceToPost}`)
//                 }
//             }).catch((error)=>{

//                 if(onError!= null){

//                     onError(error);
//                 }
//                 else{

//                     console.log(error);
//                 }
//             });

//     }










// }

// /**Represents the explicit contract of what  an RestApiClient is expected to do
//  * 
//  */
// export interface RestApiClient {
//     /**
//      * The collection of entities represented in the endpoints of the REST-api
//      */
//     entityTypes: Object[] | null;
//     /**    
//      *  Does a write-ooperation ({@link https://en.wikipedia.org/wiki/Create,_read,_update_and_delete C.R.U.D})  to some endpoint for a REST-api,
//      *  indicates whether that operation was a success via its return-parameter
//      *      
//      * @param instanceToCreate : The instance you wish to create using the REST api 
//      * @param endpointURL : The endpointURL of REST-api you wish to write to 
//      * @param onCreationComplete : callback function for handling a successfully completed create-operation, can be omitted by setting it to null 
//      * @param onError : callback function for handling a failed create-operation, can be omitted by setting it to null
//      * @returns {void} 
//      */
//     createAtEndpoint(endpointURL: URL, instanceToCreate: Object, onCreationComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Object | void) | null) : void;

//     /**
//      *  Handles read-operation ({@link https://en.wikipedia.org/wiki/Create,_read,_update_and_delete C.R.U.D}) for the REST-API
//      *
//      *
//      * 
//      * @param endpointURL The endpointURL of REST-api you wish to read from 
//      * @param onReadComplete callback function for handling a successfully completed read-operation, can be omitted by setting it to null
//      * @param onError callback function for handling a failed read-operation, can be omitted by setting it to null 
//      */
//     readAtEndpoint(endpointURL: URL, onReadComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Error | Object | void) | null) : void;
//     /**
//      *  Handles read-operation ({@link https://en.wikipedia.org/wiki/Create,_read,_update_and_delete C.R.U.D}) for the REST-API
//      *
//      *
//      * @param instanceOfEntityType - The instance you wish to update the REST api-node with, should be a member from the entityTypes-array
//      * @param endpointURL The endpointURL of REST-api you wish to read from 
//      * @param onUpdateComplete callback function for handling a successfully completed read-operation, can be omitted by setting it to null
//      * @param onError callback function for handling a failed update-operation, setting any node to null usually means we should use a DELETE-request
//      */
//     updateAtEndpoint(endpointURL: URL, instanceOfEntityType: Object, onUpdateComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Error | Object | void) | null) : void;
//     /**
//      *  Handles read-operation ({@link https://en.wikipedia.org/wiki/Create,_read,_update_and_delete C.R.U.D}) for the REST-API
//      *
//      *
//      * @param instanceOfEntityType - The instance you wish to update the REST api-node with, null means setting the node to empty
//      * @param endpointURL The endpointURL of REST-api you wish to read from 
//      * @param onDeleteComplete callback function for handling a successfully completed delete-operation
//      * @param onError callback function for handling a failed Delete-operation, can be omitted by setting it to null 
//      */
//     deleteAtEndpoint(endpointURL: URL, instanceOfEntityTypeToDelete: Object | Array<Object>, onDeleteComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Error | Object | void) | null) : void;
//     /**
//      * 
//      * @param authenticate - Handles the authentication process and returns some object(Example: A JSON-bearer token), a boolean indicating success or a string with an authentication key
//      * @param onComplete -  callback function for handling a successfully completed authentication process
//      * @param onError  - callback function for handling a failed authentication-operation
//      */
//     authenticate(authenticate: () => (Object | boolean | string), onComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Error | Object | void) | null);


// }


