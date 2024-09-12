// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
  measurementId: "YOUR_FIREBASE_MEASUREMENT_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Handle form submission
document.getElementById("registrationForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get form values
  const username = document.getElementById("username").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Basic validation
  if (!username || !contact || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    // Add user data to Firestore collection "users"
    await addDoc(collection(db, "users"), {
      username: username,
      contact: contact,
      email: email,
      password: password, // In real applications, never store plain text passwords.
    });

    alert("Registration successful!");
    // Optionally, clear the form or redirect the user
    document.getElementById("registrationForm").reset();
  } catch (error) {
    console.error("Error registering user:", error);
    alert("An error occurred while registering. Please try again.");
  }
});
