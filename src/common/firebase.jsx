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
import { getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_w6MvySSONkvhTkPPTXF_urDQtYEISRo",
  authDomain: "react-js-blog-website-d0bde.firebaseapp.com",
  projectId: "react-js-blog-website-d0bde",
  storageBucket: "react-js-blog-website-d0bde.appspot.com",
  messagingSenderId: "1069946242399",
  appId: "1:1069946242399:web:673ae1d13594d38d74e2ea",
};

const app = initializeApp(firebaseConfig);

//google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((error) => {
      console.log(error.message);
    });

  return user;
};
