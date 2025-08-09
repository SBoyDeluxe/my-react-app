import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './modules/react/components/App';
import { FirebaseAPIClient } from './modules/firebaseapiClient';
import React from 'react';
import { firebaseClient, useUserStore } from './modules/react/store/UserStore';
import { BrowserRouter } from 'react-router';


let container = document.getElementById("app")!;
let root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
        <App firebaseClient={firebaseClient}  />
    </BrowserRouter>
  </StrictMode>
);
