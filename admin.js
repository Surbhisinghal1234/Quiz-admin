
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, getDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
  apiKey: "AIzaSyCKpGfs3z9u7Wi0kCla49ZBotypfr8Vpog",
  authDomain: "login-form-50c7c.firebaseapp.com",
  projectId: "login-form-50c7c",
  storageBucket: "login-form-50c7c.appspot.com",
  messagingSenderId: "936310140629",
  appId: "1:936310140629:web:de0f0fc5272059c2af7c5c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // console.log("User is authenticated, retrieving user ID from local storage...");
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    // console.log("Logged in User ID from local storage:", loggedInUserId);

    if (loggedInUserId) {
      const docRef = doc(db, "users", loggedInUserId);
      console.log("Retrieving document with ID:", loggedInUserId);

      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log("Document data:", userData);
          const userNameElement = document.getElementById("loggedUserName");
          const userEmailElement = document.getElementById("loggedUserEmail");

          if (userNameElement && userEmailElement) {
            userNameElement.innerText = userData.name;
            userEmailElement.innerText = userData.email;
            console.log("User data set in DOM elements");
          } else {
            console.log("DOM elements for user data not found");
          }
        } else {
          console.log("No document found matching the provided ID:", loggedInUserId);
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    } else {
      console.log("User ID not found in local storage");
    }
  } else {
    console.log("User is not authenticated");
  }
});

// Log out functionality
const logOutButton = document.getElementById("logout");
if (logOutButton) {
  logOutButton.addEventListener("click", () => {
    localStorage.removeItem("loggedInUserId");
    signOut(auth).then(() => {
      window.location.href = "login.html";
    }).catch((error) => {
      console.error("Error signing out:", error);
    });
  });
} else {
  console.error("Logout button not found");
}

// //.............................. 
document.addEventListener("DOMContentLoaded", async () => {
  await fetchCategories();

  const addMoreBtn = document.getElementById("addMoreBtn");
  addMoreBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const questionSec = document.querySelector(".question-sec");
    const newQuestionSec = questionSec.cloneNode(true);

    const inputs = newQuestionSec.querySelectorAll("input");
    inputs.forEach((input) => {
      input.value = "";
    });

    document
      .getElementById("questionForm")
      .insertBefore(newQuestionSec, document.getElementById("addMoreBtn"));
  });

  const saveBtn = document.getElementById("saveBtn");
  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let message = document.getElementById("message");
    const questions = [];
    const questionSections = document.querySelectorAll(".question-sec");
    questionSections.forEach((section) => {
      const category = section.querySelector('select[name="category"]').value;
      const difficultyLevel = section.querySelector('select[name="diffcultyLevel"]').value;
      const que = section.querySelector('input[name="que"]').value;
      const options = Array.from(section.querySelectorAll('input[name="options"]')).map((input) => input.value);
      const answer = section.querySelector('input[name="answer"]').value;
      if (category && difficultyLevel && que && options.length && answer) {
        questions.push({
          category,
          difficultyLevel,
          que,
          options,
          answer,
        });
      }
    });

    try {
      const res = await fetch(
        "http://localhost:3000/questions/addQuestions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions }),
        }
      );
      const result = await res.json();
      console.log(result, "result");
      message.textContent = "Questions added successfully";
    } catch (err) {
      console.log("failed", err);
      message.textContent = "Failed to add questions";
    }
  });
});

async function fetchCategories() {
  try {
    const res = await fetch(
      "http://localhost:3000/get_categories/getCategories"
    );
    const categories = await res.json();
    const categoryAll = document.querySelectorAll(".select-cat");
    categoryAll.forEach((select) => {
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.category; 
        option.textContent = category.category;
        select.appendChild(option);
      });
    });
  } catch (err) {
    console.log("failed", err);
  }
}


