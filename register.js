
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKpGfs3z9u7Wi0kCla49ZBotypfr8Vpog",
  authDomain: "login-form-50c7c.firebaseapp.com",
  projectId: "login-form-50c7c",
  storageBucket: "login-form-50c7c.appspot.com",
  messagingSenderId: "936310140629",
  appId: "1:936310140629:web:de0f0fc5272059c2af7c5c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const signUp = document.getElementById("submitSignUp");
// signUp.addEventListener("click", (event) => {
//   event.preventDefault();
//   const name = document.getElementById("registerName").value;
//   const email = document.getElementById("registerEmail").value;
//   const password = document.getElementById("registerPassword").value;
//   let message = document.getElementById("registerMessage").value

//   const auth = getAuth();
//   const db = getFirestore();
//   createUserWithEmailAndPassword(auth,email,password).then((userCredential)=>{

//     const user = userCredential.user;
//     const userData = {
//       email:email,
//       name:name,
//     } 
//     setDoc(docRef,userData).then(()=>{
//       window.location.href= "admin.html"
//     }).catch((error)=>{
//       console.error("error writing document", error)
//     })

//   }).catch((error)=>{
//     const errorCode = error.code;
//     if(errorCode=="auth/email-already-in-use") {
//        message = "email already exists"
//     }
//     else{
//       message = "unable to create user"
//     }

//   })
// });

const signUp = document.getElementById("submitSignUp");
signUp.addEventListener("click", (event) => {
  event.preventDefault();
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  let message = document.getElementById("registerMessage");

  const auth = getAuth();
  const db = getFirestore();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        name: name,
      };
      return setDoc(doc(db, "users", user.uid), userData);
    })
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/email-already-in-use") {
        message.textContent = "Email already exists";
      } else {
        message.textContent = "Unable to create user";
      }
      console.error("Error creating user:", error);
    });
});
