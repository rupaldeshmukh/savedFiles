🧩 Folder Overview
src/
 ├── App.js
 ├── authConfig.js       ← MSAL config
 ├── msalInstance.js     ← MSAL init
 ├── LaunchDarklyClient.js ← LD safe init (CORS-safe)
 └── index.js

1️⃣ MSAL Setup (authConfig.js + msalInstance.js)
// authConfig.js
export const msalConfig = {
  auth: {
    clientId: "YOUR_MSAL_CLIENT_ID",
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
    redirectUri: "http://localhost:3000",
  },
};

// msalInstance.js
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

export const msalInstance = new PublicClientApplication(msalConfig);

2️⃣ LaunchDarkly Safe Initialization (LaunchDarklyClient.js)

This is the key part.
We’ll ensure LD requests don’t get CORS-blocked by skipping interceptors or wrapped fetches.

// LaunchDarklyClient.js
import { initialize } from "launchdarkly-js-client-sdk";

// optional: if Axios or global fetch adds auth headers, bypass them
export const disableInterceptorsForLD = () => {
  if (window.axios) {
    window.axios.interceptors.request.use((config) => {
      // Bypass LD endpoints
      if (config.url.includes("launchdarkly.com")) {
        config.headers = {}; // remove Authorization headers
      }
      return config;
    });
  }

  // Example: if your app overrides fetch globally, bypass for LD
  if (!window._originalFetch) {
    window._originalFetch = window.fetch;
    window.fetch = (url, options) => {
      if (typeof url === "string" && url.includes("launchdarkly.com")) {
        // Call original fetch directly for LD
        return window._originalFetch(url, options);
      }
      // otherwise your normal fetch flow
      return window._originalFetch(url, options);
    };
  }
};

// initialize LD after login
export const initLaunchDarkly = async (userEmail) => {
  disableInterceptorsForLD();

  const client = initialize("YOUR_CLIENT_SIDE_ID", {
    key: userEmail,
  });

  await client.waitForInitialization();
  console.log("✅ LaunchDarkly Initialized Successfully");
  return client;
};

3️⃣ Use Inside App.js (after MSAL login)

Here’s how you integrate after user login — this ensures LD initializes only after authentication.

// App.js
import React, { useEffect, useState } from "react";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { msalInstance } from "./msalInstance";
import { initLaunchDarkly } from "./LaunchDarklyClient";

function AppContent() {
  const { instance, accounts } = useMsal();
  const [ldClient, setLdClient] = useState(null);

  useEffect(() => {
    const initializeLD = async () => {
      if (accounts.length > 0) {
        const userEmail = accounts[0].username;
        const client = await initLaunchDarkly(userEmail);
        setLdClient(client);
      } else {
        // trigger login
        instance.loginPopup().catch(console.error);
      }
    };
    initializeLD();
  }, [accounts, instance]);

  return (
    <div>
      <h1>React + MSAL + LaunchDarkly</h1>
      {ldClient ? (
        <p>LaunchDarkly Initialized ✅</p>
      ) : (
        <p>Initializing LaunchDarkly...</p>
      )}
    </div>
  );
}

export default function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AppContent />
    </MsalProvider>
  );
}

4️⃣ Where CORS Would Normally Fail

If you accidentally do this 👇

axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`; // ❌ adds token to all requests
  return config;
});


or initialize LD before login:

// ❌ Wrong place — LD runs before MSAL finishes login
const client = initialize("LD_KEY", { key: "anonymous" });


you’ll get:

Access to fetch at 'https://clientstream.launchdarkly.com' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header

✅ Final Checklist
Step	Purpose	Where to Put
Disable interceptors for LD	Prevent unwanted headers	LaunchDarklyClient.js
Initialize LD after login	Ensure MSAL done	AppContent useEffect
Keep proxy clear	Avoid LD requests being redirected	package.json
Don’t modify LD URLs	Let them call official endpoints	N/A

Would you like me to include an example using Axios global interceptor and AppInsights together (since many MSAL apps use both)?
That version shows exactly how to exclude LD from both.
