// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, setDoc, deleteDoc, updateDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase configuration (replace with your Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyCOm3GlA2_UgZhhHD_zDU9BRFwLnOLueEA",
    authDomain: "monsoontours-65f1e.firebaseapp.com",
    projectId: "monsoontours-65f1e",
    storageBucket: "monsoontours-65f1e.appspot.com",
    messagingSenderId: "378330088807",
    appId: "1:378330088807:web:217c00702fc17fea671bc2",
    measurementId: "G-L4V5MLH9KD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Select elements
const itineraryContainer = document.getElementById('itineraryContainer');
const addItineraryBtn = document.getElementById('addItineraryBtn');

// Function to create an itinerary DOM element
function createItineraryElement(itineraryId, duration = "", days = "", locations = "") {
    const itineraryDiv = document.createElement('div');
    itineraryDiv.classList.add('itinerary');
    itineraryDiv.setAttribute('data-id', itineraryId);

    itineraryDiv.innerHTML = `
        <img src="itinerary_default.jpg" alt="Itinerary">
        <h2>Itinerary ${itineraryId}</h2>
        <p>Duration</p>
        <input type="text" class="duration" value="${duration}">
        <p>Days</p>
        <input type="text" class="days" value="${days}">
        <p>No. of Locations</p>
        <input type="text" class="locations" value="${locations}">
        <button class="save-btn">Save Changes</button>
        <button class="delete-btn">Delete Itinerary</button>
    `;

    // Event listener for saving changes
    itineraryDiv.querySelector('.save-btn').addEventListener('click', () => {
        saveItinerary(itineraryId, itineraryDiv);
    });

    // Event listener for deleting the itinerary
    itineraryDiv.querySelector('.delete-btn').addEventListener('click', () => {
        deleteItinerary(itineraryId, itineraryDiv);
    });

    itineraryContainer.appendChild(itineraryDiv);
}

// Function to add a new itinerary
function addItinerary() {
    const itineraryId = Date.now().toString(); // Unique ID based on timestamp
    createItineraryElement(itineraryId);
}

// Function to save itinerary data to Firestore
async function saveItinerary(itineraryId, itineraryDiv) {
    const duration = itineraryDiv.querySelector('.duration').value;
    const days = itineraryDiv.querySelector('.days').value;
    const locations = itineraryDiv.querySelector('.locations').value;

    const itineraryData = { duration, days, locations };

    try {
        await setDoc(doc(db, "itineraries", itineraryId), itineraryData);
        alert(`Itinerary ${itineraryId} saved successfully!`);
    } catch (error) {
        console.error("Error saving itinerary:", error);
        alert('Error saving itinerary. Please try again.');
    }
}

// Function to delete an itinerary from Firestore and the UI
async function deleteItinerary(itineraryId, itineraryDiv) {
    try {
        await deleteDoc(doc(db, "itineraries", itineraryId));
        itineraryDiv.remove();
        alert(`Itinerary ${itineraryId} deleted successfully!`);
    } catch (error) {
        console.error("Error deleting itinerary:", error);
        alert('Error deleting itinerary. Please try again.');
    }
}

// Event listener for the "Add Itinerary" button
addItineraryBtn.addEventListener('click', addItinerary);

// Function to load existing itineraries from Firestore
async function loadItineraries() {
    const querySnapshot = await getDocs(collection(db, "itineraries"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        createItineraryElement(doc.id, data.duration, data.days, data.locations);
    });
}

// Load itineraries on page load
loadItineraries();
