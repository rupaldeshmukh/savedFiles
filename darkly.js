✅ Targeted Fix Plan (realistic & quick)
Step 1 – Disable everything that might wrap fetch

At the very top of src/index.js (before any imports):

// --- FIRST LINES OF index.js ---
const nativeFetch = window.fetch.bind(window);
window.fetch = (url, options) => {
  if (typeof url === "string" && url.includes("launchdarkly.com")) {
    // always use untouched fetch for LaunchDarkly
    return nativeFetch(url, options);
  }
  return nativeFetch(url, options);
};


Then restart the app.
If LD starts working → you’ve proven a global fetch wrapper (AppInsights or MSAL) was the blocker.

Step 2 – Temporarily disable App Insights

Comment out the initialization line:

// import { ApplicationInsights } from '@microsoft/applicationinsights-web';
// const appInsights = new ApplicationInsights({ config: { ... }});
// appInsights.loadAppInsights();


Run again.
If it suddenly works → App Insights’ fetch auto-collection caused the issue.
Permanent fix:

new ApplicationInsights({
  config: {
    instrumentationKey: "KEY",
    disableFetchTracking: true,  // 👈 important
  },
});

Step 3 – Check axios / msal interceptors

Search your codebase for:

axios.interceptors.request.use(


If you find one, wrap it like this:

axios.interceptors.request.use((config) => {
  if (config.url && config.url.includes("launchdarkly.com")) {
    // skip token headers
    return { ...config, headers: {} };
  }
  // your normal auth logic
  return config;
});

Step 4 – Ensure no proxy rerouting

Check:

// package.json
"proxy": "https://something.yourapi.com"


➡ Remove that line or exclude LaunchDarkly in setupProxy.js:

if (req.url.includes('launchdarkly.com')) return next();

Step 5 – Service-Worker check

If serviceWorkerRegistration.js exists and registers a worker, disable it during tests:

serviceWorkerRegistration.unregister();

🔁 Why this works

In your main app, a library is globally altering fetch to:

attach MSAL tokens, or

set credentials: "include", or

rewrite URLs through a proxy.

LaunchDarkly requires pure anonymous fetches to its CDN endpoints.
By restoring native fetch for launchdarkly.com, you completely bypass those global modifications.

✅ Quick sanity test

Run in DevTools console inside your broken app:

fetch("https://clientstream.launchdarkly.com/health")
  .then(r => r.status)
  .catch(e => e.message);


If that returns 200, your network is fine — confirming it’s just internal code interception.

If you can share:

whether you’re using AppInsights or axios interceptors (yes/no),

and whether adding the native fetch patch fixed it,

then I can show the exact permanent code change (not just patch) for your case.
