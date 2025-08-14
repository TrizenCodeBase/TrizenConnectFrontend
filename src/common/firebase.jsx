// import { initializeApp } from "firebase/app";
// import { GoogleAuthProvider , getAuth} from 'firebase/auth'
// import { useRef } from "react";

// const firebaseConfig = {
//   apiKey: "AIzaSyAC-pjj4C8XADnZCgUNAGeACHHeHMkgl7g",
//   authDomain: "react-js-blog-website-yt-ded86.firebaseapp.com",
//   projectId: "react-js-blog-website-yt-ded86",
//   storageBucket: "react-js-blog-website-yt-ded86.appspot.com",
//   messagingSenderId: "815662181167",
//   appId: "1:815662181167:web:2bce34278b61f3bc928fda"
// };

// const app = initializeApp(firebaseConfig);

// //google auth

// const provider = new GoogleAuthProvider()

// const auth = getAuth();

// export const authWithGoogle = async () => {

//     let user = null;

//     await signInWithPopup(auth, provider)
//     .then((result) => {
//         user = result.user
//     })
//     .catch((err) => {
//         console.log(err)
//     })

//     return user;
// }
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";

// Debug environment variables
console.log("Environment variables check:");
console.log("VITE_FIREBASE_API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY ? "✅ Present" : "❌ Missing");
console.log("VITE_FIREBASE_PROJECT_ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID ? "✅ Present" : "❌ Missing");
console.log("Build mode:", import.meta.env.MODE);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAyUdst9s9HUcKLpGMNG9NjGPCMyhymUeA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "connect-trizen.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "connect-trizen",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "connect-trizen.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "910313173978",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:910313173978:web:ad9c16346dbfc1bbed86e3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HJ5DCBY76K"
};

console.log("Firebase config being used:", firebaseConfig);

const app = initializeApp(firebaseConfig);

//google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  try {
    // First check if there's a redirect result from previous redirect attempt
    const redirectResult = await getRedirectResult(auth);
    if (redirectResult && redirectResult.user) {
      const idToken = await redirectResult.user.getIdToken();
      console.log("Google auth successful via redirect for user:", redirectResult.user.email);
      return {
        ...redirectResult.user,
        accessToken: idToken
      };
    }

    // Try popup first
    const result = await signInWithPopup(auth, provider);
    
    // Get the ID token for backend verification
    const idToken = await result.user.getIdToken();
    
    console.log("Google auth successful via popup for user:", result.user.email);
    
    // Return user object with the idToken
    return {
      ...result.user,
      accessToken: idToken // Backend expects accessToken property
    };
  } catch (error) {
    console.error("Firebase auth error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // If popup is blocked or Cross-Origin-Opener-Policy issue, try redirect
    if (error.code === 'auth/popup-blocked' || 
        error.message.includes('Cross-Origin-Opener-Policy')) {
      console.log("Popup blocked or COOP issue, falling back to redirect...");
      await signInWithRedirect(auth, provider);
      // The redirect will reload the page, so this won't return
      return null;
    }
    
    // Throw the error so it can be handled in the calling component
    throw error;
  }
};
