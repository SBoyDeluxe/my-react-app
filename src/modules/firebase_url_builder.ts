import { Project } from "./project";
import { User,Developer,Manager,Client } from "./User";

/**Handles making requests-objects {URL, HTTPOptions},that can be used with fetch-requests to 
 * the firebase database
 * 
 */
export class FirebaseURLBuilder {

    /**
     * Returns an options object literal specifying the indicated action with the data specified 
     * 
     * @param {FirebaseURLBuilder.httpMethods} httpMethod - The type of request you want to generate options for
     * @returns {any} Object-literal with the options specified for use with fetch API
     * @see | {@linkcode FirebaseURLBuilder.httpMethods} |
     */
    static generateOptions(httpMethod:string, data:any|null):any{

        switch (httpMethod) {
            case "GET":
                let getOptions  = {
                    method:"GET",

                    headers:{
                                        accept: 'application/json',
                                        "Cache-Control" : "no-cache",


                    }

                };
                return getOptions;
                break;
            case "PUT":
                        const putOptions  = {
                    method:"PUT",

                    headers:{
                                        accept: 'application/json',
                                        "Cache-Control" : "no-cache",


                    },
                    body: JSON.stringify(data)

                };
                return putOptions;                
                break;
            case "POST":

            const postOptions  = {
                    method:"POST",

                    headers:{
                                        accept: 'application/json',
                                        "Cache-Control" : "no-cache",


                    },
                    body: JSON.stringify(data)

                };
                return postOptions;       
                
                break;
            case "PATCH":
                const patchOptions  = {
                    method:"patch",

                    headers:{
                                        accept: 'application/json',
                                        "Cache-Control" : "no-cache",


                    },
                    body: JSON.stringify(data)

                }       
                
                break;
            case "DELETE":
                const deleteOptions  = {
                    method:"delete",

                    headers:{
                                        accept: 'application/json',
                                        "Cache-Control" : "no-cache",


                    },
                    body: JSON.stringify(data)

                };
                return deleteOptions;       
                
                break;
        
            default:
                break;
        }


    }
     
  public   static options = {

                 headers: {
            accept: 'application/json',
            "Cache-Control" : "no-cache",

        
           
        }
    };

    /**Represents the HTTP methods that can be assigned to a HTTPrequest  
     * 
     * @property {string} GET - The get method string, passed in a request object to indicate a get-request 
     * @property {string} PUT - The put method string, passed in a request object to indicate a put-request 
     * @property {string} POST - The post method string, passed in a request object to indicate a post-request 
     * @property {string} PATCH - The patch method string, passed in a request object to indicate a patch-request 
     * @property {string} DELETE - The delete method string, passed in a request object to indicate a delete-request 
     * @see   | {@linkcode Request} | {@linkcode fetch} | 
     */
    public static  httpMethods = {

        GET: "GET",
        PUT: "PUT",
        POST: "POST",
        PATCH: "PATCH",
        DELETE: "DELETE"
    };
    
     /** 
     * Represents the table endpoints for the Scrumboard project:  
     * @typedef {Object} Scrumboard3000Endpoints
     * @property {string} users - Endpoint for the user table 
     * @property {string} projects - Endpoint for the projects table
     * @property {string} manager - Endpoint for the managers table
     * @property {string} developer - Endpoint for the developers table
     * @property {string} client - Endpoint for the clients table
     * @property {string} username - Endpoint for the username table                            
     *                          
     *                          
     * @see  | {@linkcode User} | {@linkcode Developer} | {@linkcode Client } | {@linkcode Project} | 
     */
   public static tableEndpoints = {
        /**@memberof Scrumboard3000Endpoints */
        /**@memberof FirebaseURLBuilder.tableEndpoints */
        users: "user.json",
        /**@memberof Scrumboard3000Endpoints */
        /**@memberof FirebaseURLBuilder.tableEndpoints */
        projects:  "project.json",
        /*manager and developer lists managers and developers and will guide a user to their userspecific data : projects. 
        They will always be called with a unique userid or be linked with a dev/prodid from the user-object*/
        /**@memberof Scrumboard3000Endpoints */
        /**@memberof FirebaseURLBuilder.tableEndpoints */
        manager: "manager.json",
        /**@memberof Scrumboard3000Endpoints */
        /**@memberof FirebaseURLBuilder.tableEndpoints */
        developer: "developer.json",
        /**@memberof Scrumboard3000Endpoints */
        /**@memberof FirebaseURLBuilder.tableEndpoints */
        client: "client.json",
        /**@memberof Scrumboard3000Endpoints */
        /**@memberof FirebaseURLBuilder.tableEndpoints */
        username: "usernames.json",
        /**@memberof Scrumboard3000Endpoints */
        /**@memberof FirebaseURLBuilder.tableEndpoints */
        projectUpdate : "projectupdate.json"






    }

    static databaseBaseUrl = "https://scrumboard3000-default-rtdb.europe-west1.firebasedatabase.app/";
    /**Creates a request for the tableEndpoints specified
     * 
     * @param {FirebaseURLBuilder.tableEndpoints} tableEndpoint : Should be a member of {@link FirebaseURLBuilder.tableEndpoints Scrumboard3000Endpoints}
     */
    static getEndpointURL(tableEndpoint:string){
        /*Builds the url string and uses it to instantiate a URL*/ 
        const urlString = `${FirebaseURLBuilder.databaseBaseUrl + tableEndpoint}`;
        const endpointURL = new URL(urlString);
        
        return endpointURL;
    }

    







} 