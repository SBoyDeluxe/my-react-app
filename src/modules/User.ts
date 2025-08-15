import { BinaryLike, KeyObject, webcrypto } from "crypto";
import { CryptoUtilObject } from "./Cryptography_Util";
import { Feature } from "./feature";
import { Project } from "./project";
import { Mail, MailBox } from "./mailbox";
import { FirebaseAPIClient } from "./firebaseapiClient";


/**
 *
 * @memberof User : and its inhertiting classes
 * 
 */
export class Username {
    username: string;

    constructor(usernameIn: string) {
        this.username = usernameIn;
    }
 
}


/**
 * Holds a private key of the user´s password for use in decrypting the user´s User entity in the users table
 * 
 * @memberof User : and its inhertiting classes
 * 
 */
export class Password {
    /**
     * Used as private decryption key for the users user-profile, should be used with the applications public key
     * 
     * @memberof Password
     */
    private _passwordKey: CryptoKey;
    public get passwordKey(): CryptoKey {
        return this._passwordKey;
    }
    /**The initilization vector used for encryption of the user-object, publically available under the user-json entry in firebase
     * @memberof Password
     */

    salt: BinaryLike

    //Implement as RSA : pub-key = pub key, priv = pass
    //Implement as AES : Store init vector with user-data and update on every get of user object
    /**
     * 
     * @param {CryptoKey} passwordKey - The users private, inextractable key used to decrypt their 
     * user profile
     * @memberof User
     */
    constructor(passwordKey: CryptoKey, salt: BinaryLike) {
        this._passwordKey = passwordKey;
        this.salt = salt;

    }

}

export type AuthParameters = {

    /**
           * Signifies the specific user id, specified by an integer ; The index inside the username-table
           * @property {number}
           *  @memberof AuthParameters
           */
    userId: number;    
    /** 
     * The public RSA-PSS key for inter-user communications, posted in the mailbox-table such that (/mailbox)[userId][0]
     * @memberof AuthParameters
     * 
     */
    publicMailboxKey: JsonWebKey,

    /**The key used to decrypt the mail in the User´s mailbox, must be unwrapped before usage
     * @memberof AuthParameters
     */
    mailboxPrivKey: ArrayBuffer,
    /**iv user to wrap the mailbox priv key
     * 
     */
    ivPrivKey: Uint8Array<ArrayBuffer>,
    /**
     * The AES-GCM key generated per session to encrypt the Json.stringify(User) that is then base64 encoded and put into the /user-table.
     * Wrapped with the {@link ivWrappedUserTableEncryptionKey init-vector} 
     * 
     */
    wrappedUserTableEncryptionKey: ArrayBuffer,

    ivWrappedUserTableEncryptionKey: ArrayBuffer, 
    /**
     * The key to wrap everything with at logout
     * 
     * @see 
     * | {@link FirebaseAPIClient.logOut}|
     */
    nextKey : {nextKey : CryptoKey, nextSalt : Uint8Array<ArrayBuffer>},
    /**
     * The hash val of the latest read of, or update by, user to their associated projects.
     *  Is compared to hashValue under /projectupdate/<projectindex>.json in firebase to see if user has latest version of a given project
     * @memberof AuthParameters
     * @returns Map<string, string> = {<projectIndex> : <hash>}
     */
    associatedProjectHashValues : Map<string, string> | null;


}



/**
 *A user is the base class for any given user, a User then is given different roles/priviligies (Manager/Client/Developer) in different
 * projects, however those are stripped down Data Transfer Objects (DTO) with public information that facilitates the communication between users (Via User-ids for inboxing and username for UI-friendly display) and identification of 
 * a User´s specific  priviligies inside a given project.
 * 
 * 
 */
export class User {


    /**
     * The username of a specific user
     * @memberof User
     * 
     * 
     */
    username: Username;

    /**
     * An opaque representation of the password as an object containing a  hashed, encrypted wrapping key derived from the username/password-pairing 
     * @memberof User
     */
    password: Password;
    /**
     * An object that holds privileged user specific information : Keys, project indices and hashes etc
     * @memberof User
     * @see  | {@link AuthParameters}|
     */
    authParameters: AuthParameters;
    /**
     * A mailbox where the user can recieve contents from other users
     * 
     * @memberof User
     */
    mailbox : MailBox;





    /**
     * 
     * @param usernameIn {string} : The username of the user
     * @param passwordIn {string} : The password for the user
     * @param userTypeIn {string} : The usertype to be constructed
     */
    constructor(usernameIn: string, passwordIn: Password, authParameters: AuthParameters, mailbox : MailBox) {

        //handle passwordkeycreation asap to minimize attack time space

        this.username = new Username(usernameIn);
        this.password = passwordIn;
        this.authParameters = authParameters;
        this.mailbox = mailbox;



    }
    /**
     * Adds a computed hash value of a project to the users authParameters
     * 
     * @param projectIndexHashKeyValuePair - {projectIndex : projectHash}
     * 
     */
    setHashVal(projectIndex : string, projectHash : string){
        const projectHashIndexPairs = this.authParameters.associatedProjectHashValues;
            if(projectHashIndexPairs){
                //If instantiated <=> We can just set the values

                projectHashIndexPairs?.set(projectIndex, projectHash);


            }
            else{

                this.authParameters.associatedProjectHashValues = new Map<string, string>();
                this.authParameters.associatedProjectHashValues.set(projectIndex, projectHash);

            }

    }

    getUserData() { }
    /**
     * This function takes the 
     * 
     */
    // protected function getPublicUserData(){


    //}

    getProjects() {
      
        
     }
    // Returns true if log in was successful, false otherwise
//   
//   @param {string} username 
//   @param {string} password 
//   @returns {User} userProfile : The user-profile (as stored in "/users"-endpoint) parsed as a User-instance
//  
//     logIn(username: string, password: string): User { }
//     /** Returns true if sign up was successful, false otherwise
//      * 
//      * @param {string} username 
//      * @param {string} password 
//      * @returns {User} userProfile : The user-profile (as stored in "/users"-endpoint) parsed as a User-instance
//      */
//     signUp(username: string, password: string): User { }






}


/**
 * The developer on a project is in charge of making sure that all their assigned features are developed and that the over-arching feature-goals are met and divided into completable tasks for any given
 * time-constraint. 
 * 
 * The developer can complete their assigned features/tasks and see their assigned features and tasks as well as tracking their progress.
 * The developer should be able to generate a schedule for a  project where they hold the position of developer
 * 
 * @see | {@linkcode Developer.signUp} | {@linkcode Developer.logIn} |
 */
export class Developer{
 







    /*What type of developer the user is, for example front end developer or backend-developer -> Helps organize Developers via competences for 
    task-assignment  */
    developerType: string[];

    userId : number;

    username : string;

    constructor(userId : number , username : string,developerType : string[] ){

        this.userId = userId;
        this.username = username;
        this.developerType = developerType;


    }

    public setDeveloperType(developerTypes : string[]){

        this.developerType = developerTypes;
    }

    public addDeveloperTypes(developerTypesToAdd:string[]){

       const newLength = this.developerType.length + developerTypesToAdd.length;

       let resultArray = new Array(newLength);
       resultArray = this.developerType.concat(developerTypesToAdd);
       this.developerType = resultArray;
    }









}
/**
 * The Manager of a project is in charge of developing the feature map in conjunction with the client (if applicable),
 *  assigning the features to their assigned developers and updating sprint-goals
 */
export class Manager  {
        /**
         * Specifies the user id of the user with manager-authority in a given project
         * 
         */
         userId : number;
       /**
         * Specifies the username of the user with manager-authority in a given project
         * 
         */
    username : string;

        /**
         * Specifies the username of the user with manager-authority in a given project
         *  
         * @example
         *    //This manager would then handle team, developer assignment and descriptions of specific financial and front-end features in a project. 
         *      managerType = ["Front-end", "Financial"];
         *      
         *       
         */
        managerType : string[]|null;
        /**
         * The team of managers that are responsible for the project together 
         * 
         * 
         * 
         */
       // managerTeam : Manager[]|null;
        /**
         * The developerTeams that the manager is in charge of assigning to features 
         * 
         *  @example
         *      const frontEndDevelopers = [{userId : 0, username:"Kalle", developerTypes : ["Front-end", "Back-end", "Animations"]}, 
         *                                  {userId : 1, username:"Johanna", developerTypes : ["Front-end", "Graphical designer", "PR"]}];
         *      const backEndDevelopers = [{userId : 0, username:"Gustav", developerTypes : ["Back-end", "Physcis-simulation", "Animations"]}, 
         *                                  {userId : 1, username:"Leif", developerTypes : ["Physcis-simulation", "Ray-tracing", "Photo"]}];
         * 
         *      this.developerTeams = [frontEndDevelopers, backEndDevelopers]
         * 
         *      
         */
       // developerTeams : Developer[][]|null;

        constructor(userId : number , username : string, 
        managerType : string[],
        //managerTeam : Manager[]|null,
        //developerTeams : Developer[][]|null
        ){


            this.userId = userId;
            this.username = username;
           // this.managerTeam = managerTeam;
           // this.developerTeams = developerTeams;
            this.managerType = managerType;
        }





}
/**
 * A client of a project has usually commisioned the project and holds no responsibility in developing or assigning features.
 * The Client inside a project should be able to see the entire project structure and get the progress of it and any specific features at any given time. The Client is in correspondence with 
 * the manager of the project to handle updating features, adjusting time-constraints etc.
 * 
 */
export class Client {
    


    userId:number;

    username : string;

    constructor(username : string, userId : number){

            this.userId = userId;
            this.username = username;

    }




}