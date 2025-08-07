import { createContext } from "react";
import { FirebaseAPIClient } from "../../firebaseapiClient";
import { User } from "../../User";



export const firebaseClientContext = createContext<FirebaseAPIClient>(new FirebaseAPIClient());