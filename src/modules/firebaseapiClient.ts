import { create } from "domain";
import { CryptoUtilObject } from "./Cryptography_Util";
import { FirebaseURLBuilder } from "./firebase_url_builder";
import { Password, User, Username } from "./User";
import { Mail, MailBox, MailContent } from "./mailbox";
import { Project, ProjectKeyObject } from "./project";
import { createPublicKey } from "crypto";
import { firebaseClient } from "./react/store/UserStore";
import { features } from "process";
import { Feature } from "./feature";
import { TimeConstraints } from "./Timeconstraints";
import { Task } from "./Task";
/**
 * FirebaseAPIClient handles the interaction and CRUD-operations between the web-application and the Firebase Realtime Data using the Firebase REST API
 * 
 * 
 */

type EventsourceData = {

    path: string,
    data: string
}
export class FirebaseAPIClient {

    /**
     * Represents the currently logged in user
     * @memberof FirebaseAPIClient
     */
    currentUser: User | null = null;




    /**
     * Creates a mailbox under /mailbox/userId 
     *  
     * @param userId 
     * @param publicKey 
     */
    async createMailBox(userId: number, publicKey: JsonWebKey) {

        const mailBoxUrl = FirebaseURLBuilder.getEndpointURL(`/mailbox/${userId}.json`);

        fetch(mailBoxUrl, FirebaseURLBuilder.generateOptions("PUT", {
            publicWebKey: publicKey

        })).then((response) => {
            if (response.ok) {

                return true;
            }
            else {
                throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - createMailBox-function in FirebaseAPIClient`);

            }

        });


    }
    /**
     * Sends mail to the user with the specified userId
     *  
     * @param userId 
     * @param data  
     */
    async sendMail(userId: number, data: MailContent) {

        const mailBoxUrl = FirebaseURLBuilder.getEndpointURL(`mailbox/${userId}.json`);

        fetch(mailBoxUrl, FirebaseURLBuilder.generateOptions("GET", null)).then((response) => {
            if (response.ok) {

                return response.json();
            }
            else {
                throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - sendMail-function in FirebaseAPIClient`);

            }

        }).then(async (json) => {
            console.log(json);
            const webKey = json.publicWebKey as JsonWebKey;
            const publicKey = await window.crypto.subtle.importKey("jwk", webKey,
                {
                    name: "RSA-OAEP",
                    hash: "SHA-512"
                }, false, ["encrypt"]);

            const encryptedData = await CryptoUtilObject.encrypt(JSON.stringify(data), publicKey, true);
            console.log(encryptedData);
            return CryptoUtilObject.encodeBase64(`${encryptedData[1]}`);
        }).then((encryptedDataAsBase64) => {
            const mailToUrl = FirebaseURLBuilder.getEndpointURL(`mailbox/${userId}`);


            fetch(mailBoxUrl, FirebaseURLBuilder.generateOptions("POST", encryptedDataAsBase64)).then((response) => {

                if (!response.ok) {
                    throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - sendMail-function in FirebaseAPIClient`);

                }
            });

        }).catch((error: Error) => { throw error });


    }
    /**
     * Should be set when invited to first project. Adds contents into the User´s mailbox on updates of projects they are part of, the MailContent has the label : "project-update"
     * 
     *  
     *      
     * 
     * @param projectIndices 
     */
    async setUpdateListener(projectHashesAndKeyObjects: Pick<Project, ("hash" | "projectKeyObject")>[], projects: Omit<Project, ("hash" | "projectKeyObject")>[], mailbox: MailBox) {
        //Url for projectupdate table

        const projectUpdateTableUrl = FirebaseURLBuilder.getEndpointURL(FirebaseURLBuilder.tableEndpoints.projectUpdate);
        const eventSource: EventSource = new EventSource(projectUpdateTableUrl);
//         const hashes = new Array(projectHashesAndKeyObjects.length);
//         const indices = new Array(projectHashesAndKeyObjects.length);

//         projectHashesAndKeyObjects.map(async (value, index) => {

//             hashes[index] = await value.hash;
//             indices[index] = await (await value.projectKeyObject).projectIndex;


//         });

//         eventSource.addEventListener("patch", async (eventSrc: any) => {
//             console.log(eventSrc);
//             //Only if an update happens in an object we care about do we want to actually trigger a re-read of the project
//             if (indices.includes(JSON.parse(eventSrc.data).path as string)) {
//                 //We get index to get the appropriate hash-val
//                 const data = JSON.parse(eventSrc.data);
//                 const index = indices.indexOf(data.path);

//                 console.log(data);
//                 console.log(index);

//                 const hash = data.data;
//                 console.log(hash);

//                 if (hash as string !== hashes[index]) {

//                     const oldProject = Object.entries(projects[index]);

//                     const updatedProject = await this.readProject(await projectHashesAndKeyObjects[index].projectKeyObject);

//                     const changes = Object.entries(updatedProject).filter((keyValuePair, index) => { keyValuePair[1] !== oldProject[index][1] });

//                     const changesAsObject = Object.fromEntries(changes);

//                     console.log(oldProject);
//                     console.log(updatedProject);
//                     console.log(changes);
//                     console.log(changesAsObject);
//                     mailbox.addContent({ label: "project-update", content: JSON.stringify(changesAsObject) });
//                 }




//             }

//         }, false);
//         eventSource.addEventListener("put", async (eventSrc: any) => {
//             console.log(eventSrc);
//             //Only if an update happens in an object we care about do we want to actually trigger a re-read of the project
//             if (indices.includes(JSON.parse(eventSrc.data).path as string)) {
//                 //We get index to get the appropriate hash-val
//                 const data = JSON.parse(eventSrc.data);
//                 const index = indices.indexOf(data.path);

//                 console.log(data);
//                 console.log(index);

//                 const hash = data.data;
//                 console.log(hash);

//                 if (hash as string !== hashes[index]) {

//                     const oldProject = Object.entries(projects[index]);

//                     const updatedProject = await this.readProject(projectHashesAndKeyObjects[index].projectKeyObject);

//                     const changes = Object.entries(updatedProject).filter((keyValuePair, index) => { keyValuePair[1] !== oldProject[index][1] });

//                     const changesAsObject = Object.fromEntries(changes);

//                     console.log(oldProject);
//                     console.log(updatedProject);
//                     console.log(changes);
//                     console.log(changesAsObject);
//                     mailbox.addContent({ label: "project-update", content: JSON.stringify(changesAsObject) });
//                 }




//             }
//         }, false);

//         return eventSource;



     }
    /**
     * Gets the mailbox for a specific user-id and deciphers the contents using the private key
     * @param userId 
     * @param privKey 
     * @returns {Promise<EventSource>} - The event-source object that can be used the owner of the specific mailbox to listen for updates
     */
    async setMailboxListener({ authParameters, mailbox }: Pick<User, ("authParameters" | "mailbox")>, privKey: CryptoKey): Promise < EventSource > {
            const mailToUrl = FirebaseURLBuilder.getEndpointURL(`mailbox/${authParameters.userId}.json`);
            const evSrc = new EventSource(mailToUrl);




            // evSrc.addEventListener("patch", (eventsrc: EventSource, ev: Event) => {

            //     console.log(eventsrc);
            //     console.log(ev);


            // });
            evSrc.addEventListener("put", async (eventsrc: any, ev: any) => {

                // If path === "/" then we should replace the whole mailbox contents array
                const eventJson = JSON.parse(eventsrc.data);

                let wantedData = {};

                if (eventJson.path === "/") {


                    //Make sure publicwebkey is not part of data
                    delete eventJson.data.publicWebKey;

                    const encodedValues = Object.values(eventJson.data);

                    const decodedValues = encodedValues.map((val) => CryptoUtilObject.decodeBase64(val));
                    // Make into uint8Arrays for decryption
                    const encryptedDataArrays = decodedValues.map((valueArray) => new Uint8Array(valueArray.split(",").map((integerAsString) => parseInt(integerAsString))));





                    let decryptedContents = await new Promise<string[]>(async (resolve, reject) => {

                        let result = encryptedDataArrays.map((encrypedData) => {
                            return CryptoUtilObject.decrypt(encrypedData, privKey, null, true);
                        })
                        resolve(await Promise.all(result));
                    });



                    mailbox.setContents(decryptedContents);

                    console.log(decryptedContents);
                }
                else {

                    //Means it´s a singular entry in some sub-index of mailbox <=> We only need to get the data and decrypt it, and then add it to the already exisiting content

                    const encodedValue = eventJson.data;

                    const decodedValue = CryptoUtilObject.decodeBase64(encodedValue);

                    const encryptedDataAsArrayBuffer = new Uint8Array(decodedValue.split(",").map((integerAsString) => parseInt(integerAsString)));

                    const decryptedData = await CryptoUtilObject.decrypt(encryptedDataAsArrayBuffer, privKey, null, true);

                    console.log(decryptedData);

                    mailbox.addContent(decryptedData);




                }







            }, false);


            return evSrc;



        }
    /**
     * Creates a project and invites the users specified in the userid list
     * 
     *  - If userids is left as undefined this function is an updater
     * @param {Project} project - The project the user wishes to create
     * @param {(number)} userIds - The user ids of the users you wish to invite for collaboration on a given project
     * @throws {Error(`HTTP-status code : ${response.status} : ${response.statusText} - createProject-function in FirebaseAPIClient`)} - on ! HttpStatus.ok
     * 
     * @see  | {@linkcode FirebaseAPIClient.getUserIds} |
     */
    async createProject(project: Project, userIds ?: number[]) {

            const hashVal = await project.hash;

            const projectKeyObject = await project.projectKeyObject;
            const projectTableUrl = FirebaseURLBuilder.getEndpointURL(`project/${projectKeyObject.projectIndex}.json`);
            const projectUpdateTableUrl = FirebaseURLBuilder.getEndpointURL(`projectupdate/${projectKeyObject.projectIndex}.json`);



            const projectData = project as Exclude<Project, ProjectKeyObject>;

            //We now encrypt the projectData and encode the result with base64 -> First we parse the JsonWebKey as a CryptoKey

            const jsonWebKey = projectKeyObject.projectKey;
            const projectCryptoKey = await window.crypto.subtle.importKey("jwk", jsonWebKey, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);

            const [initVector, uint8Array] = await CryptoUtilObject.encrypt(projectData, projectCryptoKey, false);
            //Iv first, then the contents
            const base64String = CryptoUtilObject.encodeBase64(`${initVector}:${uint8Array}`);


            fetch(projectTableUrl, FirebaseURLBuilder.generateOptions("PUT", base64String)).then((response) => {

                if (!response.ok) {

                    throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - createProject-function in FirebaseAPIClient (create project at /project)`);
                }

            });

            //To notify any user to changes in their projects we use a hash-value, since Event-source is limited in many browser to 6 or less at any given time

            fetch(projectUpdateTableUrl, FirebaseURLBuilder.generateOptions("PUT", hashVal)).then((response) => {

                console.log(response)
                if (!response.ok) {

                    throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - createProject-function in FirebaseAPIClient (hash-fetch, projectupdate-table)`);
                }


            }

            );

            this.currentUser?.setHashVal(projectKeyObject.projectIndex, hashVal);
            if (userIds) {

                await userIds.map((userid) => { this.sendMail(userid, { label: `project-invite`, content: `${projectKeyObject.projectIndex}:${Object.entries(projectKeyObject.projectKey)}` }) })
            }




        }
    /**
     * Gets a project via the ProjectKeyObject sent in project-invites
     * 
     * @param projectKeyObject  The projectKeyObject associated with the project
     * @return {Promise<Project>} The project in question
     */
    async readProject(projectKeyObject: ProjectKeyObject) {



            const jsonWebKey = projectKeyObject.projectKey;
            const projectCryptoKey = await window.crypto.subtle.importKey("jwk", jsonWebKey, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);

            //Define URL to project-table
            const projectTableUrl = FirebaseURLBuilder.getEndpointURL(`project/${projectKeyObject.projectIndex}.json`);

            //Fetch from the endpoint
            const projectPromise = fetch(projectTableUrl, FirebaseURLBuilder.generateOptions("GET", null)).then((response) => {

                if (response.ok) {

                    return response.json();
                }
                else {
                    throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - readProject-function in FirebaseAPIClient`);

                }

            }).then(async (json) => {

                /*The contents are encrypted with aes-gcm and encoded with base64 */
                const decodedJson = CryptoUtilObject.decodeBase64(json);
                console.log(decodedJson);
                const { dataBuffer, ivBuffer } = this.mapIvAndData(decodedJson);

                const decryptedData = await CryptoUtilObject.decrypt(dataBuffer, projectCryptoKey, ivBuffer, false);

                const projectData = JSON.parse(decryptedData) as Exclude<Project, ProjectKeyObject>;

                const project = deserializeProjectData(projectData);
                project.projectKeyObject = new Promise<ProjectKeyObject>((resolve) => resolve(projectKeyObject))




                return project;


            });

            return projectPromise;




            function deserializeProjectData(projectData: Project) {

                projectData.features!.forEach((element, index) => {
                  let developmentTasks =      element.developmentTasks?.map((devTask)=> new Task(devTask.type, devTask.description, devTask.timeconstraints, devTask.assignedDevelopers, null, devTask.currentTaskStatus));
                  element.developmentTasks = developmentTasks;
                });
                let features = (projectData.features !== null) ? projectData.features?.map((feature)=> new Feature(feature.title, feature.type, feature.description, new TimeConstraints(feature.timeconstraints._startdate, feature.timeconstraints._enddate), feature.developmentTasks, feature.assignedDevelopers)) : null;
                    
             

                let deserializedProject = new Project(projectData.title, projectData.managerTeam, projectData.clients, features, projectData.developerTeam, projectData.description, projectData.timeconstraints);
                return deserializedProject;
            }
        }
    /**
     * Gets a project via the ProjectKeyObject sent in project-invites
     * 
     * @param projectKeyObject  The projectKeyObject associated with the project
     * @return {Promise<Project>} The project in question
     */
    async updateProject( updatedProject : Project ,projectKeyObject: ProjectKeyObject) {



            const jsonWebKey = projectKeyObject.projectKey;

                        const projectData = updatedProject as Exclude<Project, ProjectKeyObject>;


            const hashVal = await updatedProject.getProjectHash();
            const projectCryptoKey = await window.crypto.subtle.importKey("jwk", jsonWebKey, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);

                const [initVector, uint8Array] = await CryptoUtilObject.encrypt(projectData, projectCryptoKey, false);
            //Iv first, then the contents
            const base64String = CryptoUtilObject.encodeBase64(`${initVector}:${uint8Array}`);

            //Define URL to project-table
            const projectTableUrl = FirebaseURLBuilder.getEndpointURL(`project/${projectKeyObject.projectIndex}.json`);

            const projectUpdateTableUrl= FirebaseURLBuilder.getEndpointURL(`projectupdate/${projectKeyObject.projectIndex}.json`);

            //Fetch from the endpoint
            const projectPromise = fetch(projectTableUrl, FirebaseURLBuilder.generateOptions("PUT", base64String)).then((response) => {

                if (response.ok) {

                    return response.json();
                }
                else {
                    throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - updateProject-function in FirebaseAPIClient`);

                }

            }).then(async (json) => {

                /*The contents are encrypted with aes-gcm and encoded with base64 */
                const decodedJson = CryptoUtilObject.decodeBase64(json);
                console.log(decodedJson);
                const { dataBuffer, ivBuffer } = this.mapIvAndData(decodedJson);

                const decryptedData = await CryptoUtilObject.decrypt(dataBuffer, projectCryptoKey, ivBuffer, false);

                const projectData = JSON.parse(decryptedData) as Exclude<Project, ProjectKeyObject>;

                const project = deserializeProjectData(projectData);
                project.projectKeyObject = new Promise<ProjectKeyObject>((resolve) => resolve(projectKeyObject))




                return project;


            });

             //To notify any user to changes in their projects we use a hash-value, since Event-source is limited in many browser to 6 or less at any given time

            fetch(projectUpdateTableUrl, FirebaseURLBuilder.generateOptions("POST", hashVal)).then((response) => {

                console.log(response)
                if (!response.ok) {

                    throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - updateProject-function in FirebaseAPIClient (hash-fetch, projectupdate-table)`);
                }


            }

            );

            this.currentUser?.setHashVal(projectKeyObject.projectIndex, hashVal);

            return projectPromise;




            function deserializeProjectData(projectData: Project) {
                let deserializedProject = new Project(projectData.title, projectData.managerTeam, projectData.clients, projectData.features, projectData.developerTeam, projectData.description, projectData.timeconstraints);
                return deserializedProject;
            }
        }

    /**
     * Gets the user-ids of the user with the given usernames, throws an error if none are found
     * 
     * @param usernames - The usernames of the users one wishes to get userids from, usually to post project specific {@linkcode ProjectKeyObject}
     * @throws {Error("No such usernames found")} - On no usernames found
     * @returns {Array<(number|null)>} - The user ids of the users with the given usernames if and only if the username is found otherwise null is set on the index of that username in the original in parameter
     */
    async getUserIds(usernames: string[]) {

            const usernameUrl = FirebaseURLBuilder.getEndpointURL(FirebaseURLBuilder.tableEndpoints.username);

            const response = fetch(usernameUrl, FirebaseURLBuilder.generateOptions("GET", null)).then((response) => {

                if (response.ok) {

                    return response.json();
                }
                else {
                    throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - getUserIds-function in FirebaseAPIClient`);

                }

            }).then(async (json) => {

                const decodedJson = CryptoUtilObject.decodeBase64(json);
                console.log(decodedJson);
                const { dataBuffer, ivBuffer } = this.mapIvAndData(decodedJson);


                const usernameList = await CryptoUtilObject.decrypt(dataBuffer, null, ivBuffer, false);

                //Make array to hold results
                let resultingUserIdArray = new Array<(number | null)>(usernames.length);
                //Split username list to obtain all usernames as separate strings
                const existingUsernamesArray = usernameList.split(" ");
                //Counts the number of mismatches ; If the number of mismatches == usernames.length <=> Not one username/userid pair found <=> throws error
                let nullCounter = 0;
                usernames.forEach((usernameToSearchFor, index) => {

                    const usernameExists = (existingUsernamesArray.includes(usernameToSearchFor));
                    resultingUserIdArray[index] = (usernameExists) ? existingUsernamesArray.indexOf(usernameToSearchFor) : null;
                    nullCounter += (usernameExists) ? 0 : 1;


                });
                if (nullCounter !== usernameList.length) {

                    return resultingUserIdArray;
                }
                else {
                    throw new Error("No such usernames found");
                }





            });
            return await response;
        }

    /**
     * This function takes in a user instance, checks if the specified username is available and if and only if
     * that username is available writes the user data to firebase /user, 
     * 
     */
    async signUp(username: string, password: string) {
            const fbClient: FirebaseAPIClient = this;

            //Gets the url to the username-list
            const usernameUrl = FirebaseURLBuilder.getEndpointURL(FirebaseURLBuilder.tableEndpoints.username);

            const response = fetch(usernameUrl, FirebaseURLBuilder.generateOptions("GET", null)).then((response) => {

                if (response.ok) {

                    return response.json();
                }
                else {
                    throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - signUp-function in FirebaseAPIClient`);

                }

            }).then(async (json) => {
                let usernameListLength = await new Promise<number>(async (resolve) => {

                    if (!json) {
                        resolve(1);
                    }
                    else {
                        //The list comes in base64-encoded format, we decode it
                        const decodedJson = CryptoUtilObject.decodeBase64(json);
                        console.log(decodedJson);
                        const { dataBuffer, ivBuffer } = this.mapIvAndData(decodedJson);

                        //CryptoUtilObject.decrypt(decodedJson[1],null, decodedJson[])
                        await CryptoUtilObject.decrypt(dataBuffer, null, ivBuffer, false).then(async (val) => {
                            if (val!.includes(username)) {
                                // If username is included we want to throw an error
                                window.alert("Username was taken, please try another one!");

                            }
                            else {
                                //Add new username to usernameList
                                val += ` ${username}`;
                                return resolve(val!.split(" ").length);



                            }
                        });
                    }


                });
                if (
                    json) {

                    //The list comes in base64-encoded format, we decode it
                    const decodedJson = CryptoUtilObject.decodeBase64(json);
                    console.log(decodedJson);
                    const { dataBuffer, ivBuffer } = this.mapIvAndData(decodedJson);

                    //CryptoUtilObject.decrypt(decodedJson[1],null, decodedJson[])
                    await CryptoUtilObject.decrypt(dataBuffer, null, ivBuffer, false).then(async (val) => {
                        if (val!.includes(username)) {
                            // If username is included we want to throw an error
                            throw new Error("Username was taken, please try another one!");

                        }
                        else {
                            //Add new username to usernameList
                            val += ` ${username}`;
                            console.log(val);
                            return await CryptoUtilObject.encrypt(val!, null, false);

                        }




                    }).then((encryptedData) => {
                        return CryptoUtilObject.encodeBase64(`${encryptedData![0]}:${encryptedData![1]}`);

                    }).then((base64String) => {
                        // We post it to the username list
                        return fetch(usernameUrl, FirebaseURLBuilder.generateOptions("PUT", base64String))

                    }).then((response) => {
                        if (response.ok) {
                            console.log(response);

                        }
                        else {

                            throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - Could not write to /username`);
                        }
                    }).catch((error : unknown)=>alert(error));

                    //We create the user-keys 
                    const { userTableEntry, userToAdd } = await createUser();
                    await this.createMailBox(userToAdd.authParameters.userId, userToAdd.authParameters.publicMailboxKey);


                    //Now we post it the user into /user/{Userid}

                    await fetch(FirebaseURLBuilder.getEndpointURL(`/user/${usernameListLength - 1}.json`), FirebaseURLBuilder.generateOptions("PUT", userTableEntry)).then((response) => {

                        if (response.ok) {
                            console.log(response);
                        }
                        else {
                            throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - Could not write to /users`);

                        }
                    });
                    this.currentUser = userToAdd;
                    const privKey = await CryptoUtilObject.unwrapKey(this.currentUser.authParameters.mailboxPrivKey, this.currentUser.password.passwordKey, this.currentUser.authParameters.ivPrivKey, true)
                    this.setMailboxListener({ authParameters: this.currentUser.authParameters, mailbox: this.currentUser.mailbox }, privKey);

                    return userToAdd;
                }
                else {

                    // response.ok <=> List does not exist yet <=> Any username is okay <=> We do first time set-up, but first we add the username to the usernamelist and encrypt the list using the application key :

                    const usernameList = CryptoUtilObject.encrypt([username].toString(), null, false).then((val) => {
                        console.log(val);
                        return CryptoUtilObject.encodeBase64(`${val![0]}:${val![1]}`);
                    }).then((base64String) => {
                        // We post it to the username list
                        return fetch(usernameUrl, FirebaseURLBuilder.generateOptions("PUT", base64String))

                    }).then((response) => {
                        if (response.ok) {
                            console.log(response);

                        }
                        else {

                            throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - Could not write to /username`);
                        }

                    }).catch((error) => console.log(error));

                    //First we create the password/username-based wrapping/unwrapping key - This is saved under user.password
                    const { userTableEntry, userToAdd } = await createUser();
                    await this.createMailBox(userToAdd.authParameters.userId, userToAdd.authParameters.publicMailboxKey);

                    //Now we post it the user into /user/{Userid}

                    await fetch(FirebaseURLBuilder.getEndpointURL("/user/0.json"), FirebaseURLBuilder.generateOptions("PUT", userTableEntry)).then((response) => {

                        if (response.ok) {
                            console.log(response);
                        }
                        else {
                            throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - Could not write to /users`);

                        }
                    });

                    this.currentUser = userToAdd;
                    const privKey = await CryptoUtilObject.unwrapKey(this.currentUser.authParameters.mailboxPrivKey, this.currentUser.password.passwordKey, this.currentUser.authParameters.ivPrivKey, true)
                    this.setMailboxListener({ authParameters: this.currentUser.authParameters, mailbox: this.currentUser.mailbox }, privKey);
                    return userToAdd;


                }

                /**
            * 
            * @returns {Promise<{
            *      userTableEntry: string;
            *      userToAdd: User;
            *  }>} - The base64 encoded user-object for entry into /user-table and the User-object
            * 
            * @see | {@linkcode User} |
            */
                async function createUser() {

                    const [passwordKey, salt] = await CryptoUtilObject.createUserWrapUnwrapKey(username, password, null);
                    //Create a future user key for next encryption
                    const [futureKey, futureSalt] = await CryptoUtilObject.createUserWrapUnwrapKey(username, password, null);
                    //When we have the username and the password key we save these in the user-object
                    //The user has a public mail box with an assymetric keypair, this can be used to send encrypted info to the user 
                    const [userPublicMailboxKey, [wrappedPrivateRSAKey, ivPrivKey]] = await CryptoUtilObject.createPublicPrivateKeyPairForUserMailbox(passwordKey);

                    //The userid is the
                    //The AES-GCM key is used to encrypt the entire profile and is wrapped with the iv-variable as salt. Must be decrypted with the iv/user-wrapping/unwrapping-key combination
                    const [userProfileKey, iv] = await CryptoUtilObject.generateAESGCMUserSecretKey(passwordKey);
                    const userToAdd = new User(username, new Password(passwordKey, salt), {
                        userId: usernameListLength - 1,
                        //This public user key can be used to encrypt contents for the user mailbox
                        publicMailboxKey: userPublicMailboxKey,
                        //The mailboxPriv key, used for decryption of mailbox contents is saved in authparameters. It is wrapped with the user-wrapping/unwrapping key
                        mailboxPrivKey: wrappedPrivateRSAKey,
                        //The wrapping is done with a salt, saved un iv(initilization vector - RSA private key)
                        ivPrivKey: ivPrivKey,

                        wrappedUserTableEncryptionKey: userProfileKey,
                        //Should be given upon unwrapping
                        ivWrappedUserTableEncryptionKey: iv,
                        nextKey: { nextKey: futureKey, nextSalt: futureSalt },
                        associatedProjectHashValues: null
                    }, new MailBox(userPublicMailboxKey, [""], null));
                    //We encrypt the userprofile with the unwrapped userProfileKey - The password.salt must be posted unencrypted before the user-base64string, so that we can see if we can unwrap the aesgcmkey
                    const unwrappedProfileKey = await CryptoUtilObject.unwrapKey(userProfileKey, passwordKey, iv as Uint8Array, false);
                    const [ivUserProfile, encryptedUserProfile] = await CryptoUtilObject.encrypt(userToAdd, unwrappedProfileKey, false);
                    //saltpbkdf8:${salt}:UserprofileKey${userProfileKey}:ivUserProfileKey${iv}:encryptedData${encryptedUserProfile} - salt used to generate the unwrappingkey, userprofilekey is unwrapped with that password based key and the ivUserProfilekey and
                    // then => Decrypts the userprofile
                    const userTableEntry = CryptoUtilObject.encodeBase64(`${salt}:${userProfileKey}:${iv}:${ivUserProfile!}:${encryptedUserProfile}`);


                    return { userTableEntry, userToAdd };
                }

            });



            return await response;


        }


    /**
     * Takes in a decoded base 64 string and maps it to two buffers, one holding the data and one holding the initilization vector for the encryption of that data
     * 
     * @param {string} decodedJson - The decoded base64String
     * @returns { {
     *     dataBuffer: Uint8Array<ArrayBuffer>;
     *     ivBuffer: Uint8Array<ArrayBuffer>;
     * }} - The buffer of encrypted data and the initilization vector used during encryption
    *     
    */

    private mapIvAndData(decodedJson: string) {



        const ivCSV = decodedJson.split(":")[0];
        const ivNumbers = ivCSV.split(",");
        const ivBuffer = new Uint8Array(ivNumbers.length);
        ivNumbers.forEach((value, index) => ivBuffer[index] = parseInt(value));
        const dataCSV = decodedJson.split(":")[1];
        const dataNumbers = dataCSV.split(",");
        const dataBuffer = new Uint8Array(dataNumbers.length);
        dataNumbers.forEach((value, index) => dataBuffer[index] = parseInt(value));
        console.log("data:" + dataNumbers);
        console.log("iv:" + ivBuffer);
        return { dataBuffer, ivBuffer };






    }

    /**
 * Takes in a decoded base 64 string and maps it to four buffers
 * 
 * @param {string} decodedJson - The decoded base64String
 * @returns { {
*    saltBuffer: Uint8Array<ArrayBuffer>;
*    keyBuffer: Uint8Array<ArrayBuffer>;
*    keyIvBuffer: Uint8Array<ArrayBuffer>;
*    dataBuffer: Uint8Array<ArrayBuffer>;
*    dataIvBuffer : Uint8Array<ArrayBuffer>
*}} - saltBuffer : The salt used to generate the password derived wrapping/unwrapping key | keyBuffer - The wrapped userProfileKey used to encrypt the userprofile | keyIvBuffer - The init.vector used when wrapping the userProfileKey 
*| databuffer - The encrypted userprofile   
*     
*/
    private mapIvAndDataForUserTable(decodedJson: string) {
        const saltCSV = decodedJson.split(":")[0];
        const saltNumbers = saltCSV.split(",");
        const saltBuffer = new Uint8Array(saltNumbers.length);
        saltNumbers.forEach((value, index) => saltBuffer[index] = parseInt(value));
        const keyCSV = decodedJson.split(":")[1];
        const keyNumbers = keyCSV.split(",");
        const keyBuffer = new Uint8Array(keyNumbers.length);
        keyNumbers.forEach((value, index) => keyBuffer[index] = parseInt(value));
        const keyIvCSV = decodedJson.split(":")[2];
        const keyIvNumbers = keyIvCSV.split(",");
        const keyIvBuffer = new Uint8Array(keyIvNumbers.length);
        keyIvNumbers.forEach((value, index) => keyIvBuffer[index] = parseInt(value));
        const dataIvCSV = decodedJson.split(":")[3];
        const dataIvNumbers = dataIvCSV.split(",");
        const dataIvBuffer = new Uint8Array(dataIvNumbers.length);
        dataIvNumbers.forEach((value, index) => dataIvBuffer[index] = parseInt(value));
        const dataCSV = decodedJson.split(":")[4];
        const dataNumbers = dataCSV.split(",");
        const dataBuffer = new Uint8Array(dataNumbers.length);
        dataNumbers.forEach((value, index) => dataBuffer[index] = parseInt(value));
        return { saltBuffer, keyBuffer, keyIvBuffer, dataBuffer, dataIvBuffer };


    }


    async loginUser(username: string, password: string) {

        const firebaseApiClient = this;

        //Get usernamelist to get userid
        const usernameUrl = FirebaseURLBuilder.getEndpointURL(FirebaseURLBuilder.tableEndpoints.username);

        const response = fetch(usernameUrl, FirebaseURLBuilder.generateOptions("GET", null)).then((response) => {

            if (response.ok) {

                return response.json();
            }
            else {
                throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - login-function in FirebaseAPIClient`);

            }

        }).then(async (json) => {

            //The list comes in base64-encoded format, we decode it
            const decodedJson = CryptoUtilObject.decodeBase64(json);
            console.log(decodedJson);
            const {
                dataBuffer,
                ivBuffer
            } = this.mapIvAndData(decodedJson);
            //saltpbkdf8:${salt}:UserprofileKey${userProfileKey}:ivUserProfileKey${iv}:encryptedData${encryptedUserProfile} - salt used to generate the unwrappingkey, userprofilekey is unwrapped with that password based key and the ivUserProfilekey and
            // then => Decrypts the userprofile

            //CryptoUtilObject.decrypt(decodedJson[1],null, decodedJson[])
            const userPromise = await CryptoUtilObject.decrypt(dataBuffer, null, ivBuffer, false)
                .then(async (val) => {
                    if (!val!.includes(username)) {
                        // If username is included we want to throw an error
                        throw new Error("Wrong username!");

                    }
                    else {
                        //Get index of username

                        const userId = val!.split(" ").indexOf(username);

                        return userId;



                    }

                }).then((userId) => {

                    //With the userid we can get the userobject from /user
                    const userUrl = FirebaseURLBuilder.getEndpointURL(`/user/${userId!}.json`);
                    const userResult = fetch(userUrl, FirebaseURLBuilder.generateOptions("GET", null)).then((response) => {

                        if (response.ok) {

                            return response.json();
                        }
                        else {
                            throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - login-function in FirebaseAPIClient`);

                        }


                    }).then(async (json) => {

                        const decodedJson = CryptoUtilObject.decodeBase64(json);
                        console.log(decodedJson);
                        const { saltBuffer, keyBuffer, keyIvBuffer, dataBuffer, dataIvBuffer } = this.mapIvAndDataForUserTable(decodedJson);
                        const [userKey, oldSalt] = await CryptoUtilObject.createUserWrapUnwrapKey(username, password, saltBuffer);
                        const [futureUserKey, futureSalt] = await CryptoUtilObject.createUserWrapUnwrapKey(username, password, null);


                        //We now have the wrapping/unwrapping  key -> We can unwrap the profileKey
                        const userTableKey: CryptoKey = await CryptoUtilObject.unwrapKey(keyBuffer, userKey, keyIvBuffer, false);

                        const decryptedData = await CryptoUtilObject.decrypt(dataBuffer, userTableKey, dataIvBuffer, false);
                        //The decrypted data can now be processed 
                        console.log(decryptedData);

                        let user: User = JSON.parse(decryptedData!) as User;

                        const mailBoxPrivKey = new Uint8Array(Object.values(user.authParameters.mailboxPrivKey));
                        const mailBoxIv = new Uint8Array(Object.values(user.authParameters.ivPrivKey));

                        const unwrappedMailboxPrivKey = await CryptoUtilObject.unwrapKey(mailBoxPrivKey.buffer, userKey, mailBoxIv, true);

                        user.authParameters.mailboxPrivKey = mailBoxPrivKey.buffer;
                        user.authParameters.ivPrivKey = mailBoxIv;



                        user = instantiateUser(user, firebaseApiClient, userKey, futureUserKey, futureSalt);

                        //We set up an eventsource for the logged in user´s mailbox
                        const mailBoxEventSource = await this.setMailboxListener(user, unwrappedMailboxPrivKey!);



                        user.mailbox.setEventSource(mailBoxEventSource);

                        return (user);

                    }).then((user) => {
                        //Sets current user to the validated user
                        this.currentUser = user;
                        return user;
                    });



                    return userResult;
                });
            return userPromise;

        });

        return await response;
        /**
         * Deserializes a Json-parse of the user table entry into an instantiated user-object in runtime
         * 
         * @param user - The result of running JSON.parse(userTableEntry) as User 
         * @param firebaseApiClient - The firebaseapiClient, to instantiate mailbox and being able to send mail
         * @param currentUserKey - The password key obtained from createUserWrappingUnwrappingKey using the old salt
         * @param futureUserKey - A userkey with a different salt value, to replace the currentUserKey as Password.passwordKey on log-out
         * @param futureSalt - The salt used to generate the new wrapping/unwrapping key
         * @returns {User} -The user table entry as a instantiated user-object
         */
        function instantiateUser(user: User, firebaseApiClient: FirebaseAPIClient, currentUserKey: CryptoKey, futureUserKey: CryptoKey, futureSalt: Uint8Array<ArrayBuffer>) {
            //Eventsource always null when deserializing, instantiated per session via this.setMailboxListener()

            user = new User(user.username.username, new Password(currentUserKey, user.password.salt), { nextKey: { nextKey: futureUserKey, nextSalt: futureSalt }, ivPrivKey: user.authParameters.ivPrivKey, userId: user.authParameters.userId, ivWrappedUserTableEncryptionKey: user.authParameters.ivWrappedUserTableEncryptionKey, mailboxPrivKey: user.authParameters.mailboxPrivKey, publicMailboxKey: user.authParameters.publicMailboxKey, wrappedUserTableEncryptionKey: user.authParameters.wrappedUserTableEncryptionKey, associatedProjectHashValues: user.authParameters.associatedProjectHashValues }, new MailBox(user.mailbox.publicKey, user.mailbox.contents, null));
            console.log(user);
            return user;
        }
    }
    /**
     * Log-out, we close our event-sources, generate a new AES-GCM secret key, upload a copy of the userprofile to the user-table
     * and generate new salts and ivs
     */
    async logOut() {


        //- We now use the nextKey to wrap, using different salts on each login for the pbkdf generation
        let unwrappedPrivKey = await CryptoUtilObject.unwrapKey(this.currentUser?.authParameters.mailboxPrivKey!, this.currentUser?.password.passwordKey!, this.currentUser?.authParameters.ivPrivKey!, true);
        const [mailboxPrivKey, mailBoxPrivKeyIv] = await CryptoUtilObject.wrapPrivateKey(unwrappedPrivKey, this.currentUser?.authParameters.nextKey.nextKey!);
        const [userTableEntryEncryptionKey, userTableEntryEncryptionKeyIv] = await CryptoUtilObject.generateAESGCMUserSecretKey(this.currentUser?.authParameters.nextKey.nextKey!);
        /**
         * We close the eventsources 
         */
        this.currentUser?.mailbox.closeEventSourceListeners();
        const userEntry = new User(this.currentUser?.username.username!,
            new Password(this.currentUser?.authParameters.nextKey.nextKey!, this.currentUser?.authParameters.nextKey.nextSalt!),
            {
                ivPrivKey: mailBoxPrivKeyIv, mailboxPrivKey: mailboxPrivKey, ivWrappedUserTableEncryptionKey: userTableEntryEncryptionKeyIv,
                publicMailboxKey: this.currentUser?.authParameters.publicMailboxKey!,
                userId: this.currentUser?.authParameters.userId, wrappedUserTableEncryptionKey: userTableEntryEncryptionKey, associatedProjectHashValues: this.currentUser?.authParameters.associatedProjectHashValues!
            }, this.currentUser?.mailbox);

        //Encryption and base64-encoding

        const unwrappedUserTableEntryEncryptionKey = await CryptoUtilObject.unwrapKey(userTableEntryEncryptionKey, userEntry.password.passwordKey, userTableEntryEncryptionKeyIv, false);

        const [encryptedUserDataIv, encryptedUserData] = await CryptoUtilObject.encrypt(userEntry, unwrappedUserTableEntryEncryptionKey, false);
        const userTableEntry = CryptoUtilObject.encodeBase64(`${userEntry.password.salt}:${userTableEntryEncryptionKey}:${userTableEntryEncryptionKeyIv}:${encryptedUserDataIv!}:${encryptedUserData}`);

        await fetch(FirebaseURLBuilder.getEndpointURL(`/user/${this.currentUser?.authParameters.userId}.json`), FirebaseURLBuilder.generateOptions("PUT", userTableEntry)).then((response) => {

            if (response.ok) {
                console.log(response);
            }
            else {
                throw new Error(`HTTP-status code : ${response.status} : ${response.statusText} - Could not write to /users`);

            }
        });


    }
}



/**Represents the explicit contract of what  an RestApiClient is expected to do
 * 
 */
export interface RestApiClient {
    /**
     * The collection of entities represented in the endpoints of the REST-api
     */
    entityTypes: Object[] | null;
    /**    
     *  Does a write-ooperation ({@link https://en.wikipedia.org/wiki/Create,_read,_update_and_delete C.R.U.D})  to some endpoint for a REST-api,
     *  indicates whether that operation was a success via its return-parameter
     *      
     * @param instanceToCreate : The instance you wish to create using the REST api 
     * @param endpointURL : The endpointURL of REST-api you wish to write to 
     * @param onCreationComplete : callback function for handling a successfully completed create-operation, can be omitted by setting it to null 
     * @param onError : callback function for handling a failed create-operation, can be omitted by setting it to null
     * @returns {void} 
     */
    createAtEndpoint(endpointURL: URL, instanceToCreate: Object, onCreationComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Object | void) | null): void;

    /**
     *  Handles read-operation ({@link https://en.wikipedia.org/wiki/Create,_read,_update_and_delete C.R.U.D}) for the REST-API
     *
     *
     * 
     * @param endpointURL The endpointURL of REST-api you wish to read from 
     * @param onReadComplete callback function for handling a successfully completed read-operation, can be omitted by setting it to null
     * @param onError callback function for handling a failed read-operation, can be omitted by setting it to null 
     */
    readAtEndpoint(endpointURL: URL, onReadComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Error | Object | void) | null): void;
    /**
     *  Handles read-operation ({@link https://en.wikipedia.org/wiki/Create,_read,_update_and_delete C.R.U.D}) for the REST-API
     *
     *
     * @param instanceOfEntityType - The instance you wish to update the REST api-node with, should be a member from the entityTypes-array
     * @param endpointURL The endpointURL of REST-api you wish to read from 
     * @param onUpdateComplete callback function for handling a successfully completed read-operation, can be omitted by setting it to null
     * @param onError callback function for handling a failed update-operation, setting any node to null usually means we should use a DELETE-request
     */
    updateAtEndpoint(endpointURL: URL, instanceOfEntityType: Object, onUpdateComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Error | Object | void) | null): void;
    /**
     *  Handles read-operation ({@link https://en.wikipedia.org/wiki/Create,_read,_update_and_delete C.R.U.D}) for the REST-API
     *
     *
     * @param instanceOfEntityType - The instance you wish to update the REST api-node with, null means setting the node to empty
     * @param endpointURL The endpointURL of REST-api you wish to read from 
     * @param onDeleteComplete callback function for handling a successfully completed delete-operation
     * @param onError callback function for handling a failed Delete-operation, can be omitted by setting it to null 
     */
    deleteAtEndpoint(endpointURL: URL, instanceOfEntityTypeToDelete: Object | Array<Object>, onDeleteComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Error | Object | void) | null): void;
    /**
     * 
     * @param authenticate - Handles the authentication process and returns some object(Example: A JSON-bearer token), a boolean indicating success or a string with an authentication key
     * @param onComplete -  callback function for handling a successfully completed authentication process
     * @param onError  - callback function for handling a failed authentication-operation
     */
    //authenticate(authenticate: () => (Object | boolean | string), onComplete: ((response: Response) => Object | JSON | String | void) | null, onError: ((exception: Error) => Error | Object | void) | null);


}



