// Import Firebase functions from the newer Firebase v10.13.1
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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

// Function to delete an FAQ
export async function deleteFAQ(faqId) {
    try {
        const faqDoc = doc(db, 'faqs', faqId);
        await deleteDoc(faqDoc);
        alert("FAQ deleted successfully");
    } catch (error) {
        console.error("Error deleting FAQ: ", error);
    }
}


// Function to find and delete documents with undefined or missing fields
async function deleteDocumentsWithUndefinedFields() {
    try {
        // Query to find documents in the collection
        const q = query(collection(db, "yourCollection"));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
            const docData = docSnapshot.data();
            const docId = docSnapshot.id;

            // Check if the specific field is undefined or missing
            if (docData.yourField === undefined || docData.yourField === null) {
                console.log(`Deleting document with ID: ${docId}`);

                // Delete the document
                await deleteDoc(doc(db, "yourCollection", docId));
            }
        });
    } catch (error) {
        console.error("Error deleting documents: ", error);
    }
}

// Call the function to execute
deleteDocumentsWithUndefinedFields();
