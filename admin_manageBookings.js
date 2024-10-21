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

// Set the number of rows to display per page
const rowsPerPage = 8;
let currentPage = 1;
let totalBookings = 0; // Total number of bookings

// Function to fetch vehicles from the 'vehicles' collection
async function fetchAvailableVehicles() {
    const vehiclesRef = collection(db, 'vehicles');
    const querySnapshot = await getDocs(vehiclesRef);
    const availableVehicles = [];

    querySnapshot.forEach(docSnapshot => {
        const vehicleData = docSnapshot.data();
        if (vehicleData.availability === true) {
            availableVehicles.push({
                id: docSnapshot.id,
                name: vehicleData.vehicleName || 'Unnamed Vehicle'
            });
        }
    });

    return availableVehicles;
}

// Function to update vehicle availability
async function updateVehicleAvailability(vehicleId, availability) {
    const vehicleRef = doc(db, 'vehicles', vehicleId);
    await updateDoc(vehicleRef, { availability: availability });
}

// Function to fetch and display paginated bookings
async function fetchAndDisplayBookings(page = 1) {
    const bookingsRef = collection(db, 'bookings');
    const bookingsTableBody = document.querySelector("#BookingsTable tbody");
    bookingsTableBody.innerHTML = ''; // Clear existing rows

    try {
        const querySnapshot = await getDocs(bookingsRef);
        totalBookings = querySnapshot.size;
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;

        let index = 1; // Manual index for numbering
        let displayedBookings = 0;

        // Fetch available vehicles
        const availableVehicles = await fetchAvailableVehicles();

        querySnapshot.docs.slice(startIndex, endIndex).forEach(async (docSnapshot, idx) => {
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
                    <td>${startIndex + index}</td>
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
                        <select class="vehicle-dropdown" data-id="${bookingId}">
                            <option value="">Select Vehicle</option>
                            ${availableVehicles.map(vehicle => `<option value="${vehicle.id}" ${bookingData.vehicleId === vehicle.id ? 'selected' : ''}>${vehicle.name}</option>`).join('')}
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
                    const selectedVehicle = bookingRow.querySelector('.vehicle-dropdown').value;

                    await updateBookingStatus(bookingId, selectedStatus, selectedVehicle);
                });

                // Increment the index for the next row
                index++;
                displayedBookings++;
            }

            // Check if we've displayed enough rows for this page
            if (displayedBookings >= rowsPerPage) {
                return;
            }
        });

        updatePaginationControls();
    } catch (error) {
        console.error('Error fetching bookings:', error);
    }
}

// Function to update booking status and vehicle assignment
async function updateBookingStatus(bookingId, newStatus, vehicleId) {
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnapshot = await getDoc(bookingRef);
    const bookingData = bookingSnapshot.data();

    // Update the booking document with the new status and vehicleId
    await updateDoc(bookingRef, {
        status: newStatus,
        vehicleId: vehicleId || null // Save vehicleId or null if none selected
    });

    // If booking is completed or cancelled, set the vehicle's availability back to true
    if (newStatus === 'Completed' || newStatus === 'Cancelled') {
        if (bookingData.vehicleId) {
            await updateVehicleAvailability(bookingData.vehicleId, true); // Mark the old vehicle as available
        }
    }

    // If a new vehicle is assigned, mark it as unavailable
    if (vehicleId) {
        await updateVehicleAvailability(vehicleId, false); // Mark the new vehicle as unavailable
    }

    alert('Booking and vehicle status updated!');
}

// Function to update pagination controls
function updatePaginationControls() {
    const totalPages = Math.ceil(totalBookings / rowsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Event listeners for pagination buttons
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchAndDisplayBookings(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(totalBookings / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        fetchAndDisplayBookings(currentPage);
    }
});

// Fetch and display bookings when the page loads
fetchAndDisplayBookings(currentPage);
