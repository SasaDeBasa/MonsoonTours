// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
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

// Fetch the logged-in user's ID
let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        fetchAndDisplayBookings(); // Fetch and display bookings when user is logged in
    } else {
        // Redirect to login if not logged in
        window.location.href = "login.html";
    }
});

// Function to fetch and display bookings in the user's profile page
async function fetchAndDisplayBookings() {
    if (!currentUser) return;

    const bookingsRef = collection(db, 'bookings');
    const userBookingsQuery = query(bookingsRef, where("userId", "==", currentUser.uid));
    const historyTableBody = document.querySelector("#HistoryTable tbody");
    historyTableBody.innerHTML = ''; // Clear existing rows

    try {
        const querySnapshot = await getDocs(userBookingsQuery);

        // Set up a manual index for proper numbering
        let index = 1; 

        querySnapshot.forEach(async (docSnapshot) => {
            const bookingData = docSnapshot.data();
            const bookingId = docSnapshot.id; // Document ID

            // Fetch the package details using the packageId
            const packageRef = doc(db, 'packages', bookingData.packageId);
            const packageSnapshot = await getDoc(packageRef);

            if (packageSnapshot.exists()) {
                const packageData = packageSnapshot.data();

                // Create table row for each booking
                const historyRow = document.createElement('tr');
                historyRow.innerHTML = `
                    <td>#${index}</td> <!-- Use index for numbering -->
                    <td>${packageData.packageName}</td>
                    <td>${packageData.duration} days</td>
                    <td>${new Date(bookingData.bookedAt).toLocaleDateString()}</td>
                    <td>${packageData.locations}</td>
                    <td>
                        <p class="status-badge ${bookingData.status === 'Completed' ? 'bg-secondary' : 'bg-primary'}">
                            ${bookingData.status}
                        </p>
                    </td>
                    <td>
                        <button class="btn-delete" data-id="${bookingId}" ${bookingData.status === 'Ongoing' ? 'disabled' : ''}>
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;

                historyTableBody.appendChild(historyRow);

                // Add event listener to the delete button
                const deleteButton = historyRow.querySelector('.btn-delete');
                deleteButton.addEventListener('click', async () => {
                    await deleteBooking(bookingId);
                });

                // Increment the index for the next row
                index++;
            }
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
    }
}



// Function to delete a booking
async function deleteBooking(bookingId) {
    if (confirm('Are you sure you want to delete this booking?')) {
        try {
            await deleteDoc(doc(db, 'bookings', bookingId));
            alert('Booking deleted successfully.');
            fetchAndDisplayBookings(); // Refresh the bookings list
        } catch (error) {
            console.error('Error deleting booking:', error);
            alert('Failed to delete the booking. Please try again.');
        }
    }
}
