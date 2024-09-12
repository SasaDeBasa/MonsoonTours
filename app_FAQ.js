import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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

// Function to load FAQs (this is now handled by real-time updates)
async function loadFAQs() {
    // No longer needed as onSnapshot handles real-time updates
}

// Function to add a new FAQ
async function addFAQ(question, answer) {
    try {
        const faqCollection = collection(db, 'faqs');
        await addDoc(faqCollection, { question, answer });
        document.getElementById('faqQuestion').value = '';
        document.getElementById('faqAnswer').value = '';
    } catch (error) {
        console.error("Error adding FAQ: ", error);
    }
}

// Function to delete an FAQ
async function deleteFAQ(id) {
    try {
        const faqDoc = doc(db, 'faqs', id);
        await deleteDoc(faqDoc);
    } catch (error) {
        console.error("Error deleting FAQ: ", error);
    }
}

// Function to edit an FAQ
function editFAQ(id, question, answer) {
    document.getElementById('faqQuestion').value = question;
    document.getElementById('faqAnswer').value = answer;
    document.getElementById('editFaqId').value = id; // Store ID in a hidden input or variable
    const addFaqForm = document.getElementById('addFaqForm');
    addFaqForm.removeEventListener('submit', handleAddSubmit);
    addFaqForm.addEventListener('submit', function(event) {
        event.preventDefault();
        updateFAQ(id);
    });
}

// Function to update an FAQ
async function updateFAQ(id) {
    const question = document.getElementById('faqQuestion').value;
    const answer = document.getElementById('faqAnswer').value;
    try {
        const faqDoc = doc(db, 'faqs', id);
        await updateDoc(faqDoc, { question, answer });
        document.getElementById('faqQuestion').value = '';
        document.getElementById('faqAnswer').value = '';
        const addFaqForm = document.getElementById('addFaqForm');
        addFaqForm.removeEventListener('submit', handleUpdateSubmit);
        addFaqForm.addEventListener('submit', handleAddSubmit);
    } catch (error) {
        console.error("Error updating FAQ: ", error);
    }
}

// Handle form submission for adding FAQ
function handleAddSubmit(event) {
    event.preventDefault();
    const question = document.getElementById('faqQuestion').value;
    const answer = document.getElementById('faqAnswer').value;
    addFAQ(question, answer);
}

// Handle form submission for editing FAQ
function handleUpdateSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('editFaqId').value;
    updateFAQ(id);
}

// Add event listener to the FAQ form
document.getElementById('addFaqForm').addEventListener('submit', handleAddSubmit);

// Real-time Listener for FAQ Collection
const faqCollection = collection(db, 'faqs');
onSnapshot(faqCollection, (snapshot) => {
    const faqList = document.getElementById('faqList');
    faqList.innerHTML = ''; // Clear the list first

    snapshot.forEach((docSnapshot) => {
        const faqData = docSnapshot.data();
        const faqItem = document.createElement('div');
        faqItem.classList.add('faq-list-item');
        
        faqItem.innerHTML = `
            <div>
                <strong>${faqData.question}</strong>
                <p>${faqData.answer}</p>
            </div>
            <div>
                <button class="btn btn-warning btn-sm" onclick="editFAQ('${docSnapshot.id}', '${faqData.question}', '${faqData.answer}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteFAQ('${docSnapshot.id}')">Delete</button>
            </div>
        `;
        
        faqList.appendChild(faqItem);
    });
});
