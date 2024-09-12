// Import Firebase functions from the newer Firebase v10.13.1
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

// Function to render FAQs
function renderFAQs(faqs) {
    const faqList = document.getElementById('faqList');
    faqList.innerHTML = ''; // Clear existing FAQs

    faqs.forEach((doc) => {
        const faqData = doc.data();
        const faqId = doc.id;

        const faqItem = document.createElement('div');
        faqItem.classList.add('faq-list-item');

        faqItem.innerHTML = `
            <div>
                <strong>${faqData.question}</strong>
                <p>${faqData.answer}</p>
            </div>
            <div>
                <button class="btn btn-danger btn-sm" style="background-color: black" onclick="deleteFAQ('${faqId}')">Delete</button>
            </div>
        `;

        faqList.appendChild(faqItem);
    });
}

// Function to handle FAQ editing
window.editFAQ = function(id, question, answer) {
    document.getElementById('faqId').value = id;
    document.getElementById('faqQuestion').value = question;
    document.getElementById('faqAnswer').value = answer;

    document.getElementById('addFaqForm').style.display = 'none'; // Hide add form
    document.getElementById('editFaqForm').style.display = 'block'; // Show edit form
};

// Function to update an FAQ
async function updateFAQ() {
    const id = document.getElementById('faqId').value;
    const question = document.getElementById('faqQuestion').value;
    const answer = document.getElementById('faqAnswer').value;

    try {
        const faqDoc = doc(db, 'faqs', id);
        await updateDoc(faqDoc, {
            question: question,
            answer: answer
        });

        // Clear and hide edit form
        document.getElementById('faqId').value = '';
        document.getElementById('faqQuestion').value = '';
        document.getElementById('faqAnswer').value = '';
        document.getElementById('editFaqForm').style.display = 'none'; // Hide edit form
        document.getElementById('addFaqForm').style.display = 'block'; // Show add form
        
    } catch (error) {
        console.error("Error updating FAQ: ", error);
    }
}



// Function to add a new FAQ
async function addFAQ(question, answer) {
    try {
        const faqCollection = collection(db, 'faqs');
        await addDoc(faqCollection, {
            question: question,
            answer: answer
        });
    } catch (error) {
        console.error("Error adding FAQ: ", error);
    }
}

// Real-time listener for FAQ collection
const faqCollection = collection(db, 'faqs');
onSnapshot(faqCollection, (snapshot) => {
    const faqs = snapshot.docs;
    renderFAQs(faqs);
});

// Handle form submission for adding FAQ
document.getElementById('addFaqForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const question = document.getElementById('faqQuestion').value;
    const answer = document.getElementById('faqAnswer').value;
    addFAQ(question, answer);
    document.getElementById('faqQuestion').value = '';
    document.getElementById('faqAnswer').value = '';
});



// Handle form submission for editing FAQ
document.getElementById('editFaqForm').addEventListener('submit', function(event) {
    event.preventDefault();
    updateFAQ();
});
