// Import Firebase functions from the latest version
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase configuration
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

// Function to populate the addFaqForm with the selected FAQ data
window.populateEditForm = function (faqId, question, answer) {
    // Set the values in the form fields
    document.getElementById('faqQuestion').value = question;
    document.getElementById('faqAnswer').value = answer;

    // Store the faqId in a hidden field for later use
    document.getElementById('faqId').value = faqId;

    // Change the form button text to "Update FAQ"
    const submitButton = document.querySelector('#addFaqForm button[type="submit"]');
    submitButton.textContent = "Update FAQ";

    // Change the form heading to "Modify FAQ"
    const formHeading = document.querySelector('#content5 h3');
    formHeading.textContent = "Modify FAQ";
};

// Function to update the FAQ in Firestore
async function updateFAQ(faqId, updatedQuestion, updatedAnswer) {
    try {
        // Get reference to the specific FAQ document
        const faqRef = doc(db, 'faqs', faqId);

        // Update the document with new values
        await updateDoc(faqRef, {
            question: updatedQuestion,
            answer: updatedAnswer
        });

        alert("FAQ updated successfully!");

        // Reset form and button text after update
        document.getElementById('addFaqForm').reset();
        const submitButton = document.querySelector('#addFaqForm button[type="submit"]');
        submitButton.textContent = "Add FAQ";

        // Revert the form heading to "Add a New FAQ"
        const formHeading = document.querySelector('#content5 h3');
        formHeading.textContent = "Add a New FAQ";
    } catch (error) {
        console.error("Error updating FAQ: ", error);
    }
}

// Handle form submission for updating the FAQ
document.getElementById('addFaqForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const faqId = document.getElementById('faqId').value;
    const updatedQuestion = document.getElementById('faqQuestion').value;
    const updatedAnswer = document.getElementById('faqAnswer').value;

    // Check if we're updating (faqId exists), otherwise, it's an add
    if (faqId) {
        updateFAQ(faqId, updatedQuestion, updatedAnswer);
    } else {
        // Handle the add case here if necessary
    }
});
