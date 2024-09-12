// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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

// Function to fetch tour packages and display them as Bootstrap cards
async function fetchAndDisplayPackages() {
    const packageCollectionRef = collection(db, 'packages');
    const packageContainer = document.getElementById('packageContainer');
    packageContainer.innerHTML = '';  // Clear existing content

    try {
        const querySnapshot = await getDocs(packageCollectionRef);
        querySnapshot.forEach((doc) => {
            const packageData = doc.data();
            const packageCard = `
                <div class="col-md-4 package-card">
                    <div class="card h-100 bg-dark">
                        <img src="${packageData.imageUrl}" class="card-img-top" alt="Package Image">
                        <div class="card-body">
                            <h5 class="card-title">${packageData.packageName}</h5>
                            <p class="card-text"><strong>Duration:</strong> ${packageData.duration} days</p>
                            <p class="card-text"><strong>No. of Locations:</strong> ${packageData.locations}</p>
                            <p class="card-text card-description">${packageData.description}</p>
                        </div>
                    </div>
                </div>
            `;
            packageContainer.insertAdjacentHTML('beforeend', packageCard);
        });
    } catch (error) {
        console.error('Error fetching packages:', error);
    }
}

// Fetch and display packages when the page loads
fetchAndDisplayPackages();