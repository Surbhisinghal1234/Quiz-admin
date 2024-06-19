
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


const signIn = document.getElementById("submitSignIn");
signIn.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value
    let message = document.getElementById("loginMessage").value
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        message = "login is sucessful, signMessage"
        const user = userCredential.user;
        localStorage.setItem("loggedInUserId", user.uid);
        window.location.href = "admin.html"
    }).catch((error) => {
        if (errorCode === "auth/invalid-credential") {
            message.textContent = "incorrect email or password", "signInMessage";
        } else {
            message.textContent = "Account does not exist";
        }

    })

})