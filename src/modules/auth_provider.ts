// import *  as jwtlib from "jsonwebtoken";
// import { pathToFileURL } from "node:url";
// import { CryptographyUtilObject } from "./cryptographyUtilObject";

// /**Handles the authorization of 
//  * 
//  * - The application 
//  * 
//  * 
//  */
// export class AuthorizationProvider{

//     constructor(){

//         generateKey("aes", {length})
//     }


// }

// export class BearerTokenProvider {

//     static appAuthUrl = pathToFileURL("assets/firebase_app_auth_key.json");
//     static authKeyFile: any = fetch(BearerTokenProvider.appAuthUrl).then((value) => {
//         if (value.ok) {

//             return value.json()
//         }
//         else {

//             throw new Error(`${value.status} : ${value.statusText}`);
//         }

//     }).then((value) => value).catch((error) => console.log(error));





//     /**Provides a JWT(Json Web Token), for passing authorization via service account impersonation
//      *  and exposing the custom authorization parameters to the firebase security rules
//      * @param parameters 
//      * @returns {string} jwtToken
//      */

//     public static provideJWT(parameters: (AuthParameters | null)): string {
//         if (parameters == null) {
//             const nowInSeconds: number = Date.now() * 1000;
//             const payload = {
//                 "iss": "Scrumboard3000Application",
//                 "sub": "Scrumboard3000ApplicationUser",
//                 "aud": "https://scrumboard3000-default-rtdb.europe-west1.firebasedatabase.app/",


//             };

//             const jwtHeader = {
//                 alg: "RS256",
//                 typ: "JWT",

//                 kid: this.authKeyFile.kid
//             };


//         }
//         /*Define payload for JWT*/
//         const nowInSeconds: number = Date.now() * 1000;


//         const payload = {
//             "iss": credentialAsset.client_email,
//             "sub": credentialAsset.client_email,
//             "aud": "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
//             "iat": nowInSeconds,
//             "exp": nowInSeconds + (60 * 60),  // Maximum expiration time is one hour
//             "uid": parameters.publicUserKey,
//             "claims": {

//                 publicUserKey: parameters.publicUserKey,
//                 encryptedPathKeyArray: parameters.encryptedPathKeyArray,
//                 userType: parameters.userType,


//             }

//         };

//         const jwtHeader = {
//             alg: "RS256",
//             typ: "JWT",

//             kid: credentialAsset.private_key_id
//         };

//         const token = jwtlib.sign(payload, credentialAsset.private_key, { header: jwtHeader });

//         return token;

//         /**Custom Token Claims
//                 alg	Algorithm	"RS256"
//                 iss	Issuer	Your project's service account email address
//                 sub	Subject	Your project's service account email address
//                 aud	Audience	"https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit"
//                 iat	Issued-at time	The current time, in seconds since the UNIX epoch
//                 exp	Expiration time	The time, in seconds since the UNIX epoch, at which the token expires. It can be a maximum of 3600 seconds later than the iat.
//                 Note: this only controls the time when the custom token itself expires. But once you sign a user in using signInWithCustomToken(), they will remain signed in into the device until their session is invalidated or the user signs out.
//                 uid		The unique identifier of the signed-in user must be a string, between 1-128 characters long, inclusive. Shorter uids offer better performance.
//                 claims (optional)		Optional custom claims to include in the Security Rules auth / request.auth variables
//      */



//     }

// }


// import { FirebaseApiClient } from "./firebae_api_client";
// import { generateKey, KeyObject, webcrypto } from "node:crypto";

// export class JWTBuilder {



//     /**
//      * This class builds JWT-strings for posting into firebase and uses the provided key as secret
//      * 
//      * @param {any} data - The object used as jwt-payload, a member of the specified entityTypes in FirebaseApiClient
//      * @param {string} key - The key with which the JWT should be encrypted
//      * @returns {string} - A base64, encrypted JWT-string
//      * 
//      * @see | {@linkcode FirebaseApiClient} | {@linkcode FirebaseApiClient.entityTypes} |
//      */
//     static createJwt(data: any, key: string | null): string {
//         //We create the headers
//         const jwtHeader = {
//             alg: "RS256",
//             typ: "JWT",

//         };
//         /*Define payload for JWT*/
//         const nowInSeconds: number = Date.now() * 1000;

       

//         /*Create string of data*/
        
//        let dataString : string = JSON.stringify(data);
//         const payload = {
            
//             "dataPayload": {

//                 jsonString:dataString,


                


//             }

//         };



//         const token = jwtlib.sign(payload, key, { header: jwtHeader });

//         return token;

//     }

//     static verifyJwt(jwtString: string, key: string):boolean {

//         return crypto.subtle.verify("RS256", )

//         crypto.subtle.generateKey()
//     }


// }

