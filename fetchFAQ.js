import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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
    const faqAccordion = document.getElementById('faqAccordion');
    faqAccordion.innerHTML = ''; // Clear existing FAQs

    faqs.forEach((doc) => {
        const faqData = doc.data();
        const faqId = doc.id;

        const faqItem = document.createElement('div');
        faqItem.classList.add('card');
        faqItem.classList.add('faq-item');

        faqItem.innerHTML = `
            <div class="card-header" id="heading${faqId}">
                <h5 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${faqId}" aria-expanded="true" aria-controls="collapse${faqId}">
                        ${faqData.question}
                    </button>
                </h5>
            </div>
            <div id="collapse${faqId}" class="collapse" aria-labelledby="heading${faqId}" data-parent="#faqAccordion">
                <div class="card-body">
                    ${faqData.answer}
                </div>
            </div>
        `;

        faqAccordion.appendChild(faqItem);
    });
}

// Real-time listener for FAQ collection
const faqCollection = collection(db, 'faqs');
onSnapshot(faqCollection, (snapshot) => {
    const faqs = snapshot.docs;
    renderFAQs(faqs);
});
