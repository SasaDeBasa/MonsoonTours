// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCOm3GlA2_UgZhhHD_zDU9BRFwLnOLueEA",
    authDomain: "monsoontours-65f1e.firebaseapp.com",
    projectId: "monsoontours-65f1e",
    storageBucket: "monsoontours-65f1e",
    messagingSenderId: "378330088807",
    appId: "1:378330088807:web:217c00702fc17fea671bc2",
    measurementId: "G-L4V5MLH9KD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Fetch the logged-in user's ID
let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        // Redirect to login if not logged in
        window.location.href = "login.html";
    }
});

// Function to fetch tour packages and display them as Bootstrap cards
async function fetchAndDisplayPackages() {
    const packageCollectionRef = collection(db, 'packages');
    const packageContainer = document.getElementById('packageContainer');
    packageContainer.innerHTML = '';  // Clear existing content

    try {
        const querySnapshot = await getDocs(packageCollectionRef);
        querySnapshot.forEach((doc) => {
            const packageData = doc.data();
            const packageId = doc.id; // Get the document ID
            const packageCard = `
                <div class="col-md-4 package-card">
                    <div class="card h-100 bg-dark">
                        <img src="${packageData.imageUrl}" class="card-img-top" alt="Package Image">
                        <div class="card-body">
                            <h5 class="card-title">${packageData.packageName}</h5>
                            <p class="card-text"><strong>Duration:</strong> ${packageData.duration} days</p>
                            <p class="card-text"><strong>No. of Locations:</strong> ${packageData.locations}</p>
                            <p class="card-text card-description">${packageData.description}</p>
                            <button class="btn btn-primary book-btn" data-id="${packageId}">Book Now</button>
                        </div>
                    </div>
                </div>
            `;
            packageContainer.insertAdjacentHTML('beforeend', packageCard);
        });

        // Add event listeners to the 'Book Now' buttons
        const bookButtons = document.querySelectorAll('.book-btn');
        bookButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const packageId = event.target.getAttribute('data-id');
                await bookTour(packageId);
            });
        });
    } catch (error) {
        console.error('Error fetching packages:', error);
    }
}

// Function to book a tour
async function bookTour(packageId) {
    if (!currentUser) {
        alert("Please log in to book a tour.");
        return;
    }

    const bookingData = {
        userId: currentUser.uid,
        packageId: packageId,
        bookedAt: new Date().toISOString(),
        status: "Booked" // You can modify this as needed
    };

    try {
        await addDoc(collection(db, 'bookings'), bookingData);
        alert("Tour booked successfully!");
    } catch (error) {
        console.error('Error booking tour:', error);
        alert("Failed to book the tour. Please try again.");
    }
}

// Fetch and display packages when the page loads
fetchAndDisplayPackages();
