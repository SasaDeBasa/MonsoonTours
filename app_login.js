// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase config
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
auth.languageCode = 'en';
const db = getFirestore(app);

// Google Auth Provider
const provider = new GoogleAuthProvider();

// Handle Google login button click
const googleLogin = document.getElementById("google-login-btn");
googleLogin.addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user exists in Firestore, if not, create a new user document
        const userRef = doc(db, "user", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            // User doesn't exist, create new user in Firestore
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || "",
                photoURL: user.photoURL || "",
                provider: "google"
            });
        }

        alert("Google login successful!");

        // Redirect to homepage after successful login
        window.location.href = "Home.html";
    } catch (error) {
        console.error("Error logging in with Google:", error);
        alert("Google login failed. Please try again.");
    }
});

// Handle form submission for email/password login
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
        // Sign in with Firebase Authentication (Email/Password)
        const userCredential = await signInWithEmailAndPassword(auth, usernameOrEmail, password);
        const user = userCredential.user;

        // Fetch additional user data from Firestore
        const userRef = doc(db, "user", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            alert("Login successful!");

            // Redirect to homepage
            window.location.href = "Home.html";
        } else {
            alert("User not found in the database.");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("Login failed. Please check your credentials and try again.");
    }
});
