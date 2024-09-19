// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Initialize Firebase with your configuration
const firebaseConfig = {
    apiKey: "AIzaSyCOm3GlA2_UgZhhHD_zDU9BRFwLnOLueEA",
    authDomain: "monsoontours-65f1e.firebaseapp.com",
    projectId: "monsoontours-65f1e",
    storageBucket: "monsoontours-65f1e.appspot.com",
    messagingSenderId: "378330088807",
    appId: "1:378330088807:web:217c00702fc17fea671bc2",
    measurementId: "G-L4V5MLH9KD"
};

// Initialize Firebase App and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch and display all bookings for the admin
async function fetchAndDisplayBookings() {
    const bookingsRef = collection(db, 'bookings');
    const bookingsTableBody = document.querySelector("#BookingsTable tbody");
    bookingsTableBody.innerHTML = ''; // Clear existing rows

    try {
        const querySnapshot = await getDocs(bookingsRef);
        let index = 1; // Manual index for numbering

        querySnapshot.forEach(async (docSnapshot) => {
            const bookingData = docSnapshot.data();
            const bookingId = docSnapshot.id; // Document ID

            // Fetch the package details using the packageId
            const packageRef = doc(db, 'packages', bookingData.packageId);
            const packageSnapshot = await getDoc(packageRef);

            // Fetch the user details using the userId
            const userRef = doc(db, 'user', bookingData.userId);
            const userSnapshot = await getDoc(userRef);

            if (packageSnapshot.exists() && userSnapshot.exists()) {
                const packageData = packageSnapshot.data();
                const userData = userSnapshot.data();

                // Create table row for each booking
                const bookingRow = document.createElement('tr');
                bookingRow.innerHTML = `
                    <td>${index}</td>
                    <td>${userData.username || userData.displayName || 'Unknown'}</td>
                    <td>${packageData.packageName}</td>
                    <td>${new Date(bookingData.bookedAt).toLocaleDateString()}</td>
                    <td>
                        <select class="status-dropdown" data-id="${bookingId}">
                            <option value="Pending" ${bookingData.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Ongoing" ${bookingData.status === 'Ongoing' ? 'selected' : ''}>Ongoing</option>
                            <option value="Completed" ${bookingData.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Cancelled" ${bookingData.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn-update-status" data-id="${bookingId}">Update Status</button>
                    </td>
                `;

                bookingsTableBody.appendChild(bookingRow);

                // Add event listener to the update button
                const updateButton = bookingRow.querySelector('.btn-update-status');
                updateButton.addEventListener('click', async () => {
                    const selectedStatus = bookingRow.querySelector('.status-dropdown').value;
                    await updateBookingStatus(bookingId, selectedStatus);
                });

                // Increment the index for the next row
                index++;
            }
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
    }
}

// Function to update the status of a booking
async function updateBookingStatus(bookingId, newStatus) {
    const bookingRef = doc(db, 'bookings', bookingId);
    try {
        await updateDoc(bookingRef, { status: newStatus });
        alert('Booking status updated successfully!');
    } catch (error) {
        console.error('Error updating booking status:', error);
        alert('Failed to update booking status.');
    }
}

// Fetch and display bookings when the page loads
fetchAndDisplayBookings();
