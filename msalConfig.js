// msalConfig.js
import * as Msal from "msal";
const isLocalhost = window.location.hostname === "localhost";
 
export const msalConfig = {
  auth: {
    clientId: "0ef3c3eb-4bec-4158-aea1-a487840cc336",  // Your Microsoft Entra ID client ID
    authority: "https://login.microsoftonline.com/3c8ea0e4-127c-4a02-ac65-58830e4ac608",
    redirectUri: isLocalhost ? "http://localhost:5173/auth/callback" : "https://novamax-breedqgme5buf8by.westus-01.azurewebsites.net/",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};
 
export const clientApplication = new Msal.UserAgentApplication(msalConfig);