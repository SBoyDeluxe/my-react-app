// import * as CryptoTs from "crypto-ts";
// import { decode, encode, version } from "base-64";
// import { BearerTokenProvider } from "./auth_provider";
// import * as crypt from "node:crypto";
// import { Password, User } from "./User";
// import { error } from "node:console";

// /**
//  * This class is responsible for all encryption operations used inside of the application and implements
//  * the node-native crypto.subtle-library for use with browser-environments
//  * 
//  */
// export class CryptographyUtilObject {




//     /**
//      * Generates a random value to be used as a crytpograpic key.
//      * Can be used in conjunction with generating salt-constants, iv-factors or any specific application
//      * unique string. 
//      * 
//      * 
//      * 
//      * @param {number} numberOfBytes - Must be an integer
//      * @returns  {Uint8Array[{numberOfBytes}]} - a random cryptography key
//      * 
//      *
//      */
//     static generateRandomSequence(numberOfBytes: number): Uint8Array {
//         /*Generate a byte array of desired length*/
//         const uint8Array = new Uint8Array(numberOfBytes);
//         /*Fill it with random values, using the high entropic getRandomValues for encryption purposes*/
//         return Crypto.prototype.getRandomValues(uint8Array);

//     }



//     /**Takes the data and encrypts it using the provided key
//      * 
//      * @param {string} data 
//      * @param {string | null} key 
//      * @returns encryptedDataString
//      */
//     static encrypt(data: string, key: string | null): string {

//         if (key != null) {

//             return CryptoTs.AES.encrypt(data, key).toString();
//         }
//         else {
//             return CryptoTs.AES.encrypt(data, BearerTokenProvider.authKeyFile["value"]).toString();


//         }


//     }
//    

//     /**Takes the encrypted data and decrypts it using the provided key
//      * 
//      * @param encryptedData 
//      * @param key 
//      * @returns {string} decryptedData
//      */
//     static decrypt(encryptedData: string, key: string | null): string {



//         if (key != null) {
//             return CryptoTs.AES.decrypt(encryptedData, key).toString(CryptoTs.enc.Utf8);
//         }

//         else {
//             return CryptoTs.AES.decrypt(encryptedData, BearerTokenProvider.authKeyFile["value"]).toString(CryptoTs.enc.Utf8);

//         }

//     }
//     /**Generates a secure password key that can be used in long term storage, when this is used, make sure
//      * to force garbage collection of the original password string. 
//      * 
//      * - Can be used with await for synchronous handling
//      * - Is a wrapping key for the actual decryption key used for encryption/decryption
//      * 
//      * @param {string} username - The user´s input username 
//      * @param {string} password - The user´s input password on login/sign-up
//      * @param {crypt.BinaryLike} saltBytes - The salt used in the last encryption, provided in the user-table  
//      * @returns {Promise<CryptoKey>} - The private key of the user, used in the AES-encryption of data in the application
//      * @throws {Error} - Error on failure of encryption
//      * 
//      * @see | {@linkcode User.password} | {@linkcode Promise} | {@linkcode CryptoKey} |
//      */
//     static async generatePasswordKeyForUser(username: string, password: string, saltBytes:crypt.BinaryLike): Promise<CryptoKey> {

//         /*No matter the password, we should have a cryptographically safe, unique starting value to create our key.
//           To ensure this is the case, we use the username as a salt (further ascertaining that the username/password pair is the 
//           of a unique user is the unlocking factor in our database for their specific object)

//           1 char is 1 byte, as such, our resulting "password" has the strength of a 128 char password, with not only special characters but international
//           special characters not otherwise used by the user
//         */

//         const usernameAsBytes = new TextEncoder().encode(username);
//         const passwordAsBytes = new TextEncoder().encode(password);

     

//         //We need at least 32 bit buffers for salt and password - We generate these from the username and password

//         const iterationsWantedUsername = 32 - username.length;
//         const iterationsWantedPassword = 32 - password.length;
//         //Minimize exposure time in browser
//         username = null; 
//         password = null;

//         let usernameTransformed = CryptographyUtilObject.transformUsername(usernameAsBytes, passwordAsBytes, iterationsWantedUsername);

//         //We have a very random 32uintArray of bytes based on the username

        
//         let passwordTransformed = CryptographyUtilObject.transformPassword(passwordAsBytes, usernameAsBytes, iterationsWantedPassword);



//                 let hashPromise : Promise<Buffer<ArrayBufferLike>>;

//         //Generates a predicatable base key, without any real high entropic random salt
//          crypt.scrypt(passwordTransformed, usernameTransformed, 128, (errr, deriveKey) =>{

//             if(errr){

//                 throw errr;
//             }
//             else{ 

//             hashPromise = Promise.resolve(deriveKey);
// }

//         });

//         let hash = await hashPromise;

//         // const hash = crypt.createHash("sha512" ).update(passwordAsBytes).setDefaultEncoding("utf8").digest;

//         /*We can now use this hash to derive a new scrypt key*/
        
//         let passwordPromise : Promise<Buffer<ArrayBufferLike>>;

//         let passwordKey : Buffer<ArrayBufferLike>; 
//         crypt.scrypt(passwordTransformed, hash, 256, (errr, deriveKey) =>{

//             if(errr){

//                 throw errr;
//             }
//             else{ passwordKey = deriveKey;

//             passwordPromise = Promise.resolve(passwordKey);
// }

//         } );

//        let wrapKey = crypt.webcrypto.subtle.importKey(`raw`, await passwordPromise, {
//                     name:"AES-GCM",
//                     length:256

//        }, false, ["wrapKey", "unwrapKey"]);

//         // Generate AES key with this generated private key

//  let aesGCMKeyPromise = window.crypto.subtle.importKey("raw", await passwordPromise, "AES-GCM", true, [
//     "encrypt",
//     "decrypt",
//   ]);


//   const jwkKey = crypt.webcrypto.subtle.exportKey("jwk", await aesGCMKeyPromise);
  
//   //export to JWK format - then force delete variable to minimize internal exposure time


    

//     aesGCMKeyPromise = null;

    
//   const hashAsBytes = new TextEncoder().encode(hash.toString());
  
 
//         // let passwordPromise = window.crypto.subtle.importKey("raw", hashAsBytes, `PBKDF2`, false, ["deriveKey"])
//         //     .then((key) => {

//         //         const passwordKey = window.crypto.subtle.deriveKey(
//         //             {
//         //                 name: "PBKDF2",
//         //                 hash: "sha256",
//         //                 iterations: 100000,
//         //                 salt: usernameTransformed,



//         //             }, key, "PBKDF2", false, ["decrypt"]);
//         //         return passwordKey;
//         //     }).catch((error) => { throw new Error(error + ` : In CryptoGraphyUtilObject.generatePasswordForUser, failure in : promise-structure, import/derive key`) });
//     return aesGCMKeyPromise;



//     }
    
//     /**
//      * Generates a public/private key-pair for assymetric encrypyption
//      * -> Posted in / mailbox on the index of user, where first index is this public key
//      * 
//      * 
//      */
//     static createUserMailboxKeyPair(passwordKey : Password){

//            //We can derive an encryption key from the private key

//           let keyObjectPrivateKey = crypt.KeyObject.from(passwordKey.passwordKey);
//           keyObjectPrivateKey.type = "private";
//         const publicKey =          crypt.createPublicKey(keyObjectPrivateKey);

//     }
//     /**
//      * Computes a shared secret key that can be used for decryption of a user-to-user transmission of encrypted data
//      * 
//      * @param ecdhKeyOtherUser - The public ECDH-key of the other user
//      * @param elipsisKeyHash - A hash repreenting the selection of the eliptic curve to user for the ECDH key-generation
//      * @returns {crypt.KeyObject} - The shared secret key 
//      */
//     static computeSharedSecret(ecdhKeyOtherUser : CryptoKey, elipsisKeyHash : Buffer) : crypt.KeyObject{



//     }

//     createPublicKey(username : string, userId : number){


          

//     }






//     /**
//      * 
//      * @param { Uint8Array<ArrayBuffer>} usernameAsBytes - The username encoded as a uint8bitarray
//      * @param { Uint8Array<ArrayBuffer>} passwordAsBytes - The password encoded as a uint8bitarray
//      * @param {number} iterationsWantedUsername - The number of bytes you want to add to the username length
//      * @returns { Uint8Array<ArrayBuffer>} - The transformed username as a byte array
//      */
//     private static transformUsername(usernameAsBytes: Uint8Array<ArrayBufferLike>, passwordAsBytes: Uint8Array<ArrayBufferLike>,  iterationsWantedUsername: number): Uint8Array<ArrayBuffer> {

//         let usernameTransformed = new Uint8Array(usernameAsBytes.length + iterationsWantedUsername)
//         for (let i = 0; i < usernameAsBytes.length; i++) {

//             let nthByte: number = 0;

//             usernameAsBytes.forEach((letter, index) => {
//                 //Checks so we don´t get null pointing
//                 if (passwordAsBytes.at(index)) {

//                     if ((index % i) % 2 === 0) {
//                         nthByte += (passwordAsBytes[index] - letter > 0) ? passwordAsBytes[index] - letter : letter - passwordAsBytes[index];
//                     }
//                     else {

//                         nthByte -= (passwordAsBytes[index] - letter > 0) ? passwordAsBytes[index] - letter : letter - passwordAsBytes[index];
//                     }

//                 }

//                 //Means we don´t have a value to use in the password byte array and that usernameAsBytes.length > oasswirdAsBytes
//                 else {

//                     if ((index % i) % 2 === 0) {
//                         nthByte += (passwordAsBytes[index % (passwordAsBytes.length)] - letter > 0) ? passwordAsBytes[index] - letter : letter - passwordAsBytes[index];
//                     }
//                     else {

//                         nthByte -= (passwordAsBytes[index % (passwordAsBytes.length)] - letter > 0) ? passwordAsBytes[index] - letter : letter - passwordAsBytes[index];
//                     }


//                 }
//             });

//             //nthByte has been calculated, if the byte is larger than 256 it won´t fit, so we cbeck so make sure it fits
//             if (nthByte >= 0) {
//                 nthByte = (nthByte > 256) ? nthByte % 256 : nthByte;
//             }

//             //If we have gotten a negative value we take the absolute of that value 
//             else {
//                 nthByte = -1 * nthByte;
//                 nthByte = (nthByte > 256) ? nthByte % 256 : nthByte;


//             }
//             usernameTransformed[i] = nthByte;






//         }

//         //Once these operations are complete, we have iterationsWantedUsername left before we have completed a 32 byte string
//         for (let i = 0; i < iterationsWantedUsername; i++) {

//             let nthByte: number = 0;

//             passwordAsBytes.forEach((letter, index) => {
//                 //Checks so we don´t get null pointing
//                 if (usernameAsBytes.at(index)) {

//                     if ((index % i) % 2 === 0) {
//                         nthByte += (usernameAsBytes[index] - letter > 0) ? usernameAsBytes[index] - letter : letter - usernameAsBytes[index];
//                     }
//                     else {

//                         nthByte -= (usernameAsBytes[index] - letter > 0) ? usernameAsBytes[index] - letter : letter - usernameAsBytes[index];
//                     }

//                 }

//                 //Means we don´t have a value to use in the password byte array and that usernameAsBytes.length > oasswirdAsBytes
//                 else {

//                     if ((index % i) % 2 === 0) {
//                         nthByte += (usernameAsBytes[index % (usernameAsBytes.length)] - letter > 0) ? usernameAsBytes[index] - letter : letter - usernameAsBytes[index];
//                     }
//                     else {

//                         nthByte -= (usernameAsBytes[index % (usernameAsBytes.length)] - letter > 0) ? usernameAsBytes[index] - letter : letter - usernameAsBytes[index];
//                     }


//                 }
//             });

//             //nthByte has been calculated, if the byte is larger than 256 it won´t fit, so we cbeck so make sure it fits
//             if (nthByte >= 0) {
//                 nthByte = (nthByte > 256) ? nthByte % 256 : nthByte;
//             }

//             //If we have gotten a negative value we take the absolute of that value 
//             else {
//                 nthByte = -1 * nthByte;
//                 nthByte = (nthByte > 256) ? nthByte % 256 : nthByte;


//             }

//             usernameTransformed[usernameAsBytes.length + i] = nthByte;






//         }

//         return usernameTransformed;
//     }
//     /**
//      * Transforms the given byte array into a uniquely generated set of bytes with the length of (passwordAsBytes.length + iterationsWanted)
//      * 
//      * @param { Uint8Array<ArrayBuffer>} usernameAsBytes - The username encoded as a uint8bitarray
//      * @param { Uint8Array<ArrayBuffer>} passwordAsBytes - The password encoded as a uint8bitarray
//      * @param {number} iterationsWantedPassword - The number of bytes you want to add to the passwordByteArray length length
//      * @returns { Uint8Array<ArrayBuffer>} - The transformed password as a byte array
//      */
//     private static transformPassword(passwordAsBytes: Uint8Array<ArrayBufferLike>, usernameAsBytes: Uint8Array<ArrayBufferLike>, iterationsWantedPassword: number): Uint8Array<ArrayBuffer> {

//     let passwordTransformed = new Uint8Array(passwordAsBytes.length + iterationsWantedPassword)
//         for (let i = 0; i < passwordAsBytes.length; i++) {

//             let nthByte: number = 0;

//             passwordAsBytes.forEach((letter, index) => {
//                 //Checks so we don´t get null pointing
//                 if (usernameAsBytes.at(index)) {

//                     if ((index % i) % 2 === 0) {
//                         nthByte += (usernameAsBytes[index] - letter > 0) ? usernameAsBytes[index] - letter : letter - usernameAsBytes[index];
//                     }
//                     else {

//                         nthByte -= (usernameAsBytes[index] - letter > 0) ? usernameAsBytes[index] - letter : letter - usernameAsBytes[index];
//                     }

//                 }

//                 //Means we don´t have a value to use in the password byte array and that passwordAsBytes.length > oasswirdAsBytes
//                 else {

//                     if ((index % i) % 2 === 0) {
//                         nthByte += (passwordAsBytes[index % (passwordAsBytes.length)] - letter > 0) ? usernameAsBytes[index] - letter : letter - usernameAsBytes[index];
//                     }
//                     else {

//                         nthByte -= (passwordAsBytes[index % (passwordAsBytes.length)] - letter > 0) ? usernameAsBytes[index] - letter : letter - usernameAsBytes[index];
//                     }


//                 }
//             });

//             //nthByte has been calculated, if the byte is larger than 256 it won´t fit, so we cbeck so make sure it fits
//             if (nthByte >= 0) {
//                 nthByte = (nthByte > 256) ? nthByte % 256 : nthByte;
//             }

//             //If we have gotten a negative value we take the absolute of that value 
//             else {
//                 nthByte = -1 * nthByte;
//                 nthByte = (nthByte > 256) ? nthByte % 256 : nthByte;


//             }
//             passwordTransformed[i] = nthByte;






//         }

//         //Once these operations are complete, we have iterationsWantedPassword left before we have completed a 32 byte string
//         for (let i = 0; i < iterationsWantedPassword; i++) {

//             let nthByte: number = 0;

//             usernameAsBytes.forEach((letter, index) => {
//                 //Checks so we don´t get null pointing
//                 if (usernameAsBytes.at(index)) {

//                     if ((index % i) % 2 === 0) {
//                         nthByte += (usernameAsBytes[index] - letter > 0) ? usernameAsBytes[index] - letter : letter - usernameAsBytes[index];
//                     }
//                     else {

//                         nthByte -= (usernameAsBytes[index] - letter > 0) ? usernameAsBytes[index] - letter : letter - usernameAsBytes[index];
//                     }

//                 }

//                 //Means we don´t have a value to use in the password byte array and that usernameAsBytes.length > oasswirdAsBytes
//                 else {

//                     if ((index % i) % 2 === 0) {
//                         nthByte += (usernameAsBytes[index % (usernameAsBytes.length)] - letter > 0) ? usernameAsBytes[index] - letter : letter - usernameAsBytes[index];
//                     }
//                     else {

//                         nthByte -= (usernameAsBytes[index % (usernameAsBytes.length)] - letter > 0) ? usernameAsBytes[index] - letter : letter - usernameAsBytes[index];
//                     }


//                 }
//             });

//             //nthByte has been calculated, if the byte is larger than 256 it won´t fit, so we cbeck so make sure it fits
//             if (nthByte >= 0) {
//                 nthByte = (nthByte > 256) ? nthByte % 256 : nthByte;
//             }

//             //If we have gotten a negative value we take the absolute of that value 
//             else {
//                 nthByte = -1 * nthByte;
//                 nthByte = (nthByte > 256) ? nthByte % 256 : nthByte;


//             }

//             passwordTransformed[passwordAsBytes.length + i] = nthByte;






//         }

//         return passwordTransformed;
//     }
// }