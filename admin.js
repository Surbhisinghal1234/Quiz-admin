
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, getDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
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

//.............................. 
document
.getElementById("add-question-btn")
.addEventListener("click", function () {
  const newQuestionDiv = document.createElement("div");
  newQuestionDiv.className = "questions mt-4";
  newQuestionDiv.innerHTML = `
<label class="block text-sm font-medium text-gray-700">
<span class="font-bold">Write Question</span>
<textarea class="question block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" rows="4" placeholder="Write Question..."></textarea>
</label>
<label class="block mt-4 text-sm font-medium text-gray-700">
Option-1
<input type="text" class="option1 block w-full h-10 mt-1 border border-gray-300 rounded-md shadow-sm">
</label>
<label class="block mt-4 text-sm font-medium text-gray-700">
Option-2
<input type="text" class="option2 block w-full mt-1 h-10 border border-gray-300 rounded-md shadow-sm">
</label>
<label class="block mt-4 text-sm font-medium text-gray-700">
Option-3
<input type="text" class="option3 block w-full mt-1 h-10 border border-gray-300 rounded-md shadow-sm">
</label>
<label class="block mt-4 text-sm font-medium text-gray-700">
Option-4
<input type="text" class="option4 block w-full mt-1 h-10 border border-gray-300 rounded-md shadow-sm">
</label>
<label class="block mt-4 text-sm font-medium text-gray-700">
Answer
<input type="text" class="answer block w-full mt-1 h-10 border border-gray-300 rounded-md shadow-sm">
</label>
`;
  document
    .getElementById("questions-container")
    .appendChild(newQuestionDiv);
});


document.getElementById("save-btn").addEventListener("click", async function () {
const questionsDivs = document.querySelectorAll(".questions");
const questions = [];
const level = document.getElementById("level").value;
const category = document.getElementById("category").value;
const message = document.querySelector(".message");

console.log("Level:", level);
console.log("Category:", category);

questionsDivs.forEach((div) => {
const questionText = div.querySelector(".question").value;
const option1 = div.querySelector(".option1").value;
const option2 = div.querySelector(".option2").value;
const option3 = div.querySelector(".option3").value;
const option4 = div.querySelector(".option4").value;
const answer = div.querySelector(".answer").value;

const question = {
    que: questionText,
    options: [option1, option2, option3, option4],
    answer: answer,
};

questions.push(question);
});

console.log("Questions:", questions);

try {
const response = await fetch("http://localhost:3000/questions/addQuestions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        category: category,
        difficultyLevel: level,
        questions: questions,
    }),
});

if (!response.ok) {
    console.log("Failed to save questions");
    message.innerHTML = "Failed to save questions";
    return;
}

const data = await response.json();
console.log("Response", data);
message.innerHTML = "Questions saved successfully!";
} catch (error) {
console.error("Error:", error);
message.innerHTML = error.message || "Error saving questions";
}
});


//........................................
