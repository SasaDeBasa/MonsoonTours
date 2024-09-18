// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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

// Function to edit an FAQ
export async function editFAQ(faqId, updatedQuestion, updatedAnswer) {
    try {
        const faqDoc = doc(db, 'faqs', faqId);  // Reference the specific FAQ document by its ID
        await updateDoc(faqDoc, {
            question: updatedQuestion,  // Update the question field
            answer: updatedAnswer       // Update the answer field
        });
        alert('FAQ updated successfully');
    } catch (error) {
        console.error("Error updating FAQ: ", error);
        alert("There was an error updating the FAQ. Please try again.");
    }
}


// Function to populate the form fields for editing
export function populateEditForm(faqId, question, answer) {
    // Populate form fields
    document.getElementById('faqId').value = faqId;  // Set hidden field with FAQ ID
    document.getElementById('faqQuestion').value = question;  // Populate question field
    document.getElementById('faqAnswer').value = answer;  // Populate answer field

    // Toggle visibility of the forms
    document.getElementById('addFaqForm').style.display = 'none';  // Hide add form
    document.getElementById('editFaqForm').style.display = 'block';  // Show edit form
}


