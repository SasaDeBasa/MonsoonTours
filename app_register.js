// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Handle registration form submission (Email/Password)
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
        // Register user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user information in Firestore
        await setDoc(doc(db, "user", user.uid), {
            uid: user.uid,
            username: username,
            contact: contact,
            email: user.email
        });

        alert("Registration successful!");

        // Redirect to homepage or another page after successful registration
        window.location.href = "Home.html";
    } catch (error) {
        console.error("Error registering user:", error);
        alert("Registration failed. Please try again.");
    }
});

// Handle Google sign-up
document.querySelector(".social-login a").addEventListener("click", async (event) => {
    event.preventDefault();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user already exists in Firestore, if not create a new record
        const userRef = doc(db, "user", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            // Create a new user document if it doesn't exist
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || "",
                photoURL: user.photoURL || "",
                provider: "google"
            });
        }

        alert("Google sign-up successful!");

        // Redirect to homepage
        window.location.href = "Home.html";
    } catch (error) {
        console.error("Error signing up with Google:", error);
        alert("Google sign-up failed. Please try again.");
    }
});
