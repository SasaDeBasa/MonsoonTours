// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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
auth.languageCode ='en';
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

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
        // Check if the user exists in the Firestore collection
        const userCollection = collection(db, "user");
        const q = query(userCollection, where("email", "==", usernameOrEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("No user found with this email.");
            return;
        }

        // Get the user document
        let userDoc = null;
        querySnapshot.forEach(doc => {
            userDoc = doc.data();
        });

        // Check if the password matches
        if (userDoc && userDoc.password === password) {
            // Sign in with Firebase Authentication
            await signInWithEmailAndPassword(auth, usernameOrEmail, password);

            // Show success message
            alert("Login successful!");

            // Redirect the user to the homepage
            window.location.href = "Home.html";
        } else {
            alert("Incorrect password.");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("An error occurred while logging in. Please check your credentials and try again.");
    }
});
