import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './modules/react/components/App';
import { FirebaseAPIClient } from './modules/firebaseapiClient';

let fbclient = new FirebaseAPIClient();
fbclient.loginUser("Hej", "Hej")
let container = document.getElementById("app")!;
let root = createRoot(container)
root.render(
  <StrictMode>
    <App firebaseClient={fbclient} />
  </StrictMode>
);
