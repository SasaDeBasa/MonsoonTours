// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCOm3GlA2_UgZhhHD_zDU9BRFwLnOLueEA",
    authDomain: "monsoontours-65f1e.firebaseapp.com",
    projectId: "monsoontours-65f1e",
    storageBucket: "monsoontours-65f1e.appspot.com",
    messagingSenderId: "378330088807",
    appId: "1:378330088807:web:217c00702fc17fea671bc2",
    measurementId: "G-L4V5MLH9KD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle form submission
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get form values
    const usernameOrEmail = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Basic validation
    if (!usernameOrEmail || !password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        // Sign in with Firebase Authentication
        await signInWithEmailAndPassword(auth, usernameOrEmail, password);

        alert("Login successful!");
        // Optionally, redirect the user to another page
        window.location.href = "Home.html";
    } catch (error) {
        console.error("Error logging in:", error);
        alert("An error occurred while logging in. Please check your credentials and try again.");
    }
});
