import { json } from "stream/consumers";
import { FirebaseAPIClient } from "./firebaseapiClient";
import { ProjectKeyObject } from "./project";

/**
 * This type represents encrypted content ready to be placed into a users mailbox
 * 
 */
export type Mail = {

        /**
         * The encrypted content
         * 
         */
        content: Uint8Array<ArrayBuffer>

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
        label?: "project-invite" | "message" | "project-update";
        /**
         * Any object in a suitable string format, all objects described in the string should be separated with ":"
         * 
         * @example
         *   content :  `${project.projectKeyObject.projectIndex}:${project.projectKeyObject.projectKey}`
         */
        content: string




}

export class MailBox {
        /** 
         * The public RSA-PSS key used by all other users to encrypt any sensitive data they want to send to a specific user 
         * 
         * @property {@linkcode Mailbox}
         */
        publicKey: JsonWebKey;
        /**
         * The contents of the mailbox, base64-encoded strings of encrypted <JSON.stringify(dataModelObject)> using the RSA-PSS public key of the mailbox
         * @memberof MailBox
         */
        contents: string[];
        /** 
         * The client used to send and recieve mail
         */
        // firebaseApiClient: FirebaseAPIClient;

        eventSource: EventSource | null;

        constructor(publicKey: JsonWebKey, contents: string[], eventSource: EventSource | null) {

                this.publicKey = publicKey;
                this.contents = contents;
                this.eventSource = eventSource;
                // this.firebaseApiClient = fbClient;
        }
        /**
         * Gets all project indices and the jsonwebkeys sent to the user
         * 
         * @returns {{
         * projectIndex: string;
         *     webKey: JsonWebKey;
         *             }[]} The values of a projectKeyObject under {projectIndex:string, webKey:JsonWebKey}
         */
        public getProjectInvites() {

                const invites = this.contents.filter((string) => string.includes("project-invite"));
                if (invites) {
                        //string has format {..."content:"<projectindex>:<projectJsonWebKeyEntries>"}
                        let contents = invites.map((stringWithLabels) => stringWithLabels.split("\"content\":\"")[1]);
                        contents.forEach((contentString) => contentString = contentString.substring(0, contentString.length-3));
                        //Split on `:` -> projectIndex on one [0], webkey on [1] -> Every even number : (index+1)%2 === 0 ? <webkey> : <projectIndex>
                        const projectIndicesAndWebKeys = contents.map((contentString) => {
                                const splitContent = contentString.split(":");

                                //JsonWebKey structure ; alg : string, ext : boolean, k : string, key_ops : string[], kty : string -> Splitting on "," gives us pairs, only on indexOf(key-ops)-> indexOf(kty) do we need to real deserialization
                                const elementsOfJsonWebKey = splitContent[1].split(",");

                                //Get indexOf "key_ops" && "kty"

                                const indexKeyOps = elementsOfJsonWebKey.indexOf("key_ops");
                                const indexKty = elementsOfJsonWebKey.indexOf("kty");
                                
                                //All strings between indexKeyops and indexKty are keyOpValues
                                const keyOpValues = elementsOfJsonWebKey.filter((val, index) => ((index > indexKeyOps) && (index < indexKty)));
                                let jsonWebKey = {};
                                for (let i = 0; i < elementsOfJsonWebKey.length-1; i += 2) {
                                        if (!((i > indexKeyOps) && (i < indexKty)) || i === indexKty) {

                                                jsonWebKey = { ...jsonWebKey, [elementsOfJsonWebKey[i]]: elementsOfJsonWebKey[i + 1] }
                                        }
                                        else {
                                                jsonWebKey = { ...jsonWebKey, ["key_ops"]: keyOpValues }
                                        }
                                }
                                jsonWebKey = {
                                        ...jsonWebKey, 
                                        ["kty"] : elementsOfJsonWebKey[indexKty+1].substring(0, elementsOfJsonWebKey[indexKty+1].length-2)
                                }

                                console.log(jsonWebKey);

                                return {
                                        ["projectIndex"]: splitContent[0],
                                        ["webKey"]: jsonWebKey as JsonWebKey,
                                }



                        });

                        return projectIndicesAndWebKeys;


                }


        }

        public setContents(contents: string[]) {

                this.contents = contents;
        }

        public setEventSource(mailboxEventSource: EventSource) {

                this.eventSource = mailboxEventSource;
        }
        /**
         * Closes the event-source if one such has been assigned to the object
         * 
         *      - Must be called on log-out to avoid memory leakage
         */
        public closeEventSourceListeners() {

                if (this.eventSource) {

                        this.eventSource.close();
                }
        }

        public addContent(mail: string) {
                if (this.contents[0]==="" || this.contents[0] === undefined) {

                        this.contents = [mail]
                }
                else {
                        this.contents.concat(mail);
                }
        }


}