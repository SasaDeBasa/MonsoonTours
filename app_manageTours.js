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
const packageContainer = document.getElementById('packageContainer');
const addPackageBtn = document.getElementById('addPackageBtn');

// Function to create a tour package DOM element
function createPackageElement(packageId, packageName = "", description = "", duration = "",locations="", imageUrl = "") {
    const packageDiv = document.createElement('div');
    packageDiv.classList.add('package');
    packageDiv.setAttribute('data-id', packageId);

    packageDiv.innerHTML = `
        <img src="${imageUrl || 'default.jpg'}" alt="${packageName}" class="package-image">
        <h2>Package Name: <input type="text" class="package-name" value="${packageName}" placeholder="Package Name"></h2>
        <p>Description:</p>
        <input type="text" class="description" value="${description}" placeholder="Enter description">
        <p>Duration (in days):</p>
        <input type="text" class="duration" value="${duration}" placeholder="Duration">
        <p>No. of Locations:</p>
        <input type="text" class="locations" value="${locations}" placeholder="Locations">
        <p>Image URL:</p>
        <input type="text" class="image-url" value="${imageUrl}" placeholder="Enter image URL">
        <button class="save-btn">Save Changes</button>
        <button class="delete-btn">Delete Package</button>
    `;

    // Event listener for saving changes
    packageDiv.querySelector('.save-btn').addEventListener('click', () => {
        savePackage(packageId, packageDiv);
    });

    // Event listener for deleting the package
    packageDiv.querySelector('.delete-btn').addEventListener('click', () => {
        deletePackage(packageId, packageDiv);
    });

    packageContainer.appendChild(packageDiv);
}

// Function to add a new tour package
function addPackage() {
    const packageId = Date.now().toString(); // Unique ID based on timestamp
    createPackageElement(packageId);
}

// Function to save package data to Firestore
async function savePackage(packageId, packageDiv) {
    const packageName = packageDiv.querySelector('.package-name').value;
    const description = packageDiv.querySelector('.description').value;
    const duration = packageDiv.querySelector('.duration').value;
    const locations = packageDiv.querySelector('.locations').value;
    const imageUrl = packageDiv.querySelector('.image-url').value;

    const packageData = { packageName, description, duration, locations, imageUrl };

    try {
        await setDoc(doc(db, "packages", packageId), packageData);
        alert(`Tour package ${packageId} saved successfully!`);
    } catch (error) {
        console.error("Error saving package:", error);
        alert('Error saving package. Please try again.');
    }
}

// Function to delete a package from Firestore and the UI
async function deletePackage(packageId, packageDiv) {
    try {
        await deleteDoc(doc(db, "packages", packageId));
        packageDiv.remove();
        alert(`Tour package ${packageId} deleted successfully!`);
    } catch (error) {
        console.error("Error deleting package:", error);
        alert('Error deleting package. Please try again.');
    }
}

// Event listener for the "Add Tour Package" button
addPackageBtn.addEventListener('click', addPackage);

// Function to load existing packages from Firestore
async function loadPackages() {
    const querySnapshot = await getDocs(collection(db, "packages"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        createPackageElement(doc.id, data.packageName, data.description, data.duration,data.locations, data.imageUrl);
    });
}

// Load packages on page load
loadPackages();
