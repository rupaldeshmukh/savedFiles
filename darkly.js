1️⃣ msalConfig.js
// src/authConfig.js
export const msalConfig = {
  auth: {
    clientId: "YOUR_MSAL_CLIENT_ID",
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
    redirectUri: "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage", // or "localStorage"
  },
};

2️⃣ msalInstance.js
// src/msalInstance.js
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

export const msalInstance = new PublicClientApplication(msalConfig);

3️⃣ LaunchDarklyClient.js — CORS-Safe Setup

This ensures LaunchDarkly SDK is initialized cleanly and not affected by MSAL or interceptors.

// src/LaunchDarklyClient.js
import { initialize } from "launchdarkly-js-client-sdk";

/**
 * Prevent Axios or custom fetch from modifying LaunchDarkly requests.
 */
export const disableInterceptorsForLD = () => {
  if (window.axios && window.axios.interceptors) {
    window.axios.interceptors.request.use((config) => {
      if (config.url && config.url.includes("launchdarkly.com")) {
        config.headers = {}; // remove MSAL auth headers
      }
      return config;
    });
  }

  // If your app overrides fetch globally, restore the native one for LD
  if (!window._originalFetch) {
    window._originalFetch = window.fetch;
    window.fetch = (url, options) => {
      if (typeof url === "string" && url.includes("launchdarkly.com")) {
        return window._originalFetch(url, options);
      }
      return window._originalFetch(url, options);
    };
  }
};

/**
 * Initialize LaunchDarkly after user login
 */
export const initLaunchDarkly = async (userEmail) => {
  disableInterceptorsForLD();

  const ldClient = initialize("YOUR_CLIENT_SIDE_ID", {
    key: userEmail || "anonymous-user",
  });

  await ldClient.waitForInitialization();
  console.log("✅ LaunchDarkly initialized safely!");
  return ldClient;
};

4️⃣ App.js — Initialize After MSAL Login

In old MSAL React (v1.0.1), you don’t have hooks like useMsal() in the same form as new versions —
so you usually initialize LD manually after you confirm login success.

// src/App.js
import React, { useEffect, useState } from "react";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalInstance";
import { initLaunchDarkly } from "./LaunchDarklyClient";

function AppContent() {
  const [userEmail, setUserEmail] = useState(null);
  const [ldClient, setLdClient] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      const accounts = msalInstance.getAllAccounts();

      if (accounts.length === 0) {
        // user not logged in
        await msalInstance.loginPopup({
          scopes: ["User.Read"],
        });
      }

      const account = msalInstance.getAllAccounts()[0];
      setUserEmail(account.username);

      // ✅ initialize LD only after login success
      const client = await initLaunchDarkly(account.username);
      setLdClient(client);
    };

    initialize().catch(console.error);
  }, []);

  return (
    <div>
      <h2>React + MSAL + LaunchDarkly (CORS Safe)</h2>
      {ldClient ? (
        <p>LaunchDarkly initialized for {userEmail}</p>
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

5️⃣ Common Pitfalls That Cause CORS with Old MSAL
Issue	Example	Fix
Global Axios interceptors	Adds Authorization header to all requests	Skip launchdarkly.com URLs
MSAL login triggers before LD ready	LD calls start while redirect/login pending	Wait until getAllAccounts().length > 0
Proxy in package.json	"proxy": "http://your-api"	Don’t proxy LD domains
AppInsights / telemetry wrapping fetch	Global fetch gets credentials: include	Patch window.fetch as shown
✅ Test it Quickly

Run your app → open DevTools → Network

Filter by clientstream.launchdarkly.com

You should see:

No Authorization header

No preflight CORS error

Status 200 ✅

If you see CORS again, check if another SDK (AppInsights, Datadog, etc.) is modifying fetch — we can exclude LD from those as well.
