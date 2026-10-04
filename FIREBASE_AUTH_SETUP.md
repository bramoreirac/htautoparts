# Firebase Authentication and Hosting Setup

This guide adds real customer sign-in to the existing static HTAutoParts site and prepares it for Firebase Hosting. It covers authentication and site deployment; it does **not** turn the current checkout into a real order or payment system.

## 1. Create and configure Firebase

1. In the [Firebase console](https://console.firebase.google.com/), create a project for HTAutoParts. Register a **Web app** and copy its `firebaseConfig` values.
2. Open **Build → Authentication → Sign-in method** and enable **Email/Password**. In **Authentication → Settings → Authorized domains**, add the domain that will host the site. Add `localhost` for local testing if needed; newer Firebase projects do not include it by default. Keep the production project's authorized domains limited to those you use. See [Firebase's domain guidance](https://firebase.google.com/docs/auth/faq-and-troubleshooting).
3. In **Authentication → Users**, add a disposable test user, or implement the registration flow in step 4. Configure the email sender and templates before inviting customers.
4. Set up a budget alert and review the [Firebase launch checklist](https://firebase.google.com/support/guides/launch-checklist) before public deployment.

## 2. Connect the existing login form

The current `login.html` already has `loginForm`, `loginEmail`, `loginPassword`, `togglePassword`, and `loginStatus`. Its `js/login.js` currently displays an unavailable message. Replace that placeholder when the Firebase project is ready.

Create `js/firebase-config.js` using the values from your Firebase Web app:

```js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const app = initializeApp({
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    appId: "YOUR_APP_ID"
});

export const auth = getAuth(app);
```

In `login.html`, change the login script to `<script type="module" src="js/login.js"></script>`. Keep the existing `js/app.js` script unchanged. In `js/login.js`, keep the password visibility handler and replace its submit handler with this flow:

```js
import { signInWithEmailAndPassword } from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

const form = document.getElementById("loginForm");
const status = document.getElementById("loginStatus");

form.addEventListener("submit", async event => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    status.textContent = "Signing in…";

    try {
        await signInWithEmailAndPassword(
            auth,
            document.getElementById("loginEmail").value.trim(),
            document.getElementById("loginPassword").value
        );
        window.location.assign("index.html");
    } catch (error) {
        console.error("Sign-in failed:", error.code);
        status.textContent = "Could not sign in. Check your email and password.";
        button.disabled = false;
    }
});
```

Use a generic public error so the form does not reveal whether an account exists. Preserve the `togglePassword` logic when editing the file. The Firebase web configuration identifies the project; it is not an authorization secret. Protect user data with Firebase Security Rules and keep **server credentials and payment keys out of browser JavaScript**. See [Firebase's API key guidance](https://firebase.google.com/docs/projects/api-keys) and [web setup documentation](https://firebase.google.com/docs/web/setup). The direct browser imports above are convenient for this no-build project; Firebase recommends a module bundler for a production app.

## 3. Add account recovery and registration

Before offering sign-in publicly, add a `register.html` form and a password-reset action linked from `login.html`. The corresponding SDK calls are:

```js
import { createUserWithEmailAndPassword, sendEmailVerification,
         sendPasswordResetEmail } from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

const credential = await createUserWithEmailAndPassword(auth, email, password);
await sendEmailVerification(credential.user);

// In the reset-password form's submit handler:
await sendPasswordResetEmail(auth, email);
```

Add visible success/error feedback, disable buttons while requests run, and use `autocomplete="email"` and `autocomplete="new-password"` on registration fields. Do not block password-manager autofill or paste. See [account creation](https://firebase.google.com/docs/auth/web/start) and [password reset](https://firebase.google.com/docs/auth/web/manage-users).

Use `onAuthStateChanged(auth, callback)` on pages that show account state; show a sign-out action only when a user is signed in. A hidden link or a browser-side redirect does **not** secure private data. If customer profiles or order history are later stored in Firestore, write and test rules that restrict each customer's records to their Firebase UID. See [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started).

## 4. Test authentication locally

1. Run `python -m http.server 8000` from the repository root and open `http://localhost:8000/login.html`. Do not test through a `file://` URL.
2. Sign in with the test user, then test an incorrect password and an unknown email. Confirm the form reports an error and allows another attempt.
3. Test password visibility, keyboard tab order, browser autofill, registration, verification email, password reset, and sign-out once those flows are added.
4. Check the browser console for SDK or domain errors. Test again on the production domain after deployment.

## 5. Deploy only public site files

Install the [Firebase CLI](https://firebase.google.com/docs/cli) with Node.js available, then run `firebase login` and `firebase init hosting`. Select this Firebase project, choose `public` as the public directory, and answer **No** to the single-page-app rewrite prompt: this site has separate HTML pages. The generated `firebase.json` should point to `public`.

Copy the site files into that directory before each deployment. In PowerShell, from the repository root:

```powershell
New-Item -ItemType Directory -Force public | Out-Null
Copy-Item -Path *.html,products.json -Destination public -Force
Copy-Item -Path css,js,images -Destination public -Recurse -Force
firebase deploy --only hosting
```

Check that `public/` contains `index.html`, `login.html`, `products.json`, `css/`, `js/`, and `images/`. Keep `.git/`, `.agents/`, guide files, and any future server secrets outside the deployed directory. For repeated deployments, use a clean staging directory or build script so deleted source assets do not linger in `public/`. Firebase Hosting provides HTTPS and supports a custom domain; configure the custom domain in Hosting and add it to Authentication's authorized domains. See the [Hosting quickstart](https://firebase.google.com/docs/hosting/quickstart).

## 6. Separate launch gate for orders and payments

`js/checkout.js` currently shows a success alert, removes the cart from `localStorage`, and returns to the home page. No order is recorded and no payment is taken. Do not present that action as a completed purchase on a live store. Before accepting orders, add a trusted backend (for example, a [Firebase callable function](https://firebase.google.com/docs/functions/callable)) that verifies the signed-in user if required, reads authoritative product prices, recalculates totals, creates the order, and handles payment through a provider's server-side flow. Guest checkout needs its own server-side order path. Never trust client-supplied prices or a browser-only confirmation.
