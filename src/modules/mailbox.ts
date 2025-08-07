import { FirebaseAPIClient } from "./firebaseapiClient";

/**
 * This type represents encrypted content ready to be placed into a users mailbox
 * 
 */
export type Mail = {
     
        /**
         * The encrypted content
         * 
         */
        content : Uint8Array<ArrayBuffer>

}
/**
 * Represents content to be encrypted and place inside a user´s mailbox
 * 
 * 
 * 
 */
export type MailContent = {
        /**
         * A string describing the contents 
         * 
         * @example
         *  const mail = {
         *                      label : "project-invite",
         *                      content :  `${project.projectKeyObject.projectIndex}:${project.projectKeyObject.projectKey}`
         *                      }
         */
        label? : "project-invite"|"message"|"project-update";
        /**
         * Any object in a suitable string format, all objects described in the string should be separated with ":"
         * 
         * @example
         *   content :  `${project.projectKeyObject.projectIndex}:${project.projectKeyObject.projectKey}`
         */
        content : string

        


}

export class MailBox{
        /** 
         * The public RSA-PSS key used by all other users to encrypt any sensitive data they want to send to a specific user 
         * 
         * @property {@linkcode Mailbox}
         */
        publicKey : JsonWebKey;
        /**
         * The contents of the mailbox, base64-encoded strings of encrypted <JSON.stringify(dataModelObject)> using the RSA-PSS public key of the mailbox
         * @memberof MailBox
         */
         contents : string[];
        /** 
         * The client used to send and recieve mail
         */
         firebaseApiClient : FirebaseAPIClient;

         eventSource : EventSource|null;

        constructor(publicKey : JsonWebKey, contents:string[], eventSource:EventSource|null, fbClient : FirebaseAPIClient){

                this.publicKey = publicKey;
                this.contents = contents;
                this.eventSource = eventSource;
                this.firebaseApiClient = fbClient;
        }

        public setContents(contents : string[]){

                this.contents = contents;
        }

        public setEventSource(mailboxEventSource : EventSource){

                this.eventSource = mailboxEventSource;
        }
        /**
         * Closes the event-source if one such has been assigned to the object
         * 
         *      - Must be called on log-out to avoid memory leakage
         */
        public closeEventSourceListeners(){

                if(this.eventSource){

                        this.eventSource.close();
                }
        }

        public addContent(mail : MailContent){

                this.contents.concat(JSON.stringify(mail));
        }


}