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

    // Clear existing FAQs before rendering new ones
    faqList.innerHTML = '';

    faqs.forEach((doc) => {
        const faqData = doc.data(); // Get FAQ data from the document snapshot
        const faqId = doc.id; // Get the FAQ document ID

        const faqItem = document.createElement('div');
        faqItem.classList.add('faq-item');

        // Create HTML for FAQ item
        faqItem.innerHTML = `
            <h4>${faqData.question}</h4>
            <p>${faqData.answer}</p>
            <button onclick="populateEditForm('${faqId}', '${faqData.question}', '${faqData.answer}')">Edit</button>
            <button onclick="deleteFAQ('${faqId}')">Delete</button>
        `;

        // Append the new FAQ item to the list
        faqList.appendChild(faqItem);
    });
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
    const faqId = document.getElementById('faqId').value;
    const question = document.getElementById('faqQuestion').value;
    const answer = document.getElementById('faqAnswer').value;
    
   
    addFAQ(question, answer);

    // console.log("FAQ ID:", faqId);
    // console.log("Question:", faqQuestion);
    // console.log("Answer:", faqAnswer);
    
    document.getElementById('faqQuestion').value = '';
    document.getElementById('faqAnswer').value = '';
});