// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

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
const auth = getAuth(app);

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
                await handleTourBooking(packageId);
            });
        });
    } catch (error) {
        console.error('Error fetching packages:', error);
    }
}

// Function to handle tour booking (with login check)
async function handleTourBooking(packageId) {
    // Check if the user is logged in
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // If user is not logged in, redirect them to the login page
            alert("Please log in to book a tour.");
            window.location.href = "login.html";
        } else {
            // If logged in, proceed with booking the tour
            await bookTour(user, packageId);
        }
    });
}

// Function to book a tour
async function bookTour(user, packageId) {
    // Check for existing bookings for the same package
    const bookingsRef = collection(db, 'bookings');
    const existingBookingsQuery = await getDocs(bookingsRef);
    let hasOngoingOrBookedTour = false;
    let hasBookedPackage = false;

    existingBookingsQuery.forEach((doc) => {
        const bookingData = doc.data();
        if (bookingData.userId === user.uid) {
            // Check if there is any ongoing or booked tour
            if (bookingData.status === "Ongoing" || bookingData.status === "Pending") {
                hasOngoingOrBookedTour = true;
            }
            // Check if the user has booked the same package
            if (bookingData.packageId === packageId) {
                hasBookedPackage = true;
            }
        }
    });

    if (hasOngoingOrBookedTour) {
        alert("You cannot book a new tour while you have an ongoing or booked tour.");
        return;
    }

    if (hasBookedPackage) {
        alert("You have already booked this tour.");
        return;
    }

    const bookingData = {
        userId: user.uid,
        packageId: packageId,
        bookedAt: new Date().toISOString(),
        status: "Pending" // You can modify this as needed
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
