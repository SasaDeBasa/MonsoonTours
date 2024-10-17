// Import the Firebase modules you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Your web app's Firebase configuration
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
const db = getFirestore(app);

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Check if any field is empty
    if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        // Save form data to Firestore
        await addDoc(collection(db, 'contacts'), {
            name: name,
            email: email,
            message: message,
            timestamp: serverTimestamp(),
        });

        alert('Your message has been sent successfully!');

        // Clear form fields after submission
        document.getElementById('contactForm').reset();
    } catch (error) {
        alert('Error sending message: ' + error.message);
    }
});
