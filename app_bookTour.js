// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOm3GlA2_UgZhhHD_zDU9BRFwLnOLueEA",
  authDomain: "monsoontours-65f1e.firebaseapp.com",
  projectId: "monsoontours-65f1e",
  storageBucket: "monsoontours-65f1e.appspot.com",
  messagingSenderId: "378330088807",
  appId: "1:378330088807:web:217c00702fc17fea671bc2",
  measurementId: "G-L4V5MLH9KD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("bookTourForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Get the tour ID input value
    const tourId = document.getElementById("tourId").value;

    try {
      // Reference to the document in the "tour" collection with the specified tour ID
      const docRef = doc(db, "tour", tourId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Display the tour details in the designated area
        const tourData = docSnap.data();
        const tourDetailsDiv = document.getElementById("tourDetails");

        // Create tour details HTML
        tourDetailsDiv.innerHTML = `
          <h4>Tour Details</h4>
          <p><strong>Name:</strong> ${tourData.name}</p>
          <p><strong>Description:</strong> ${tourData.description}</p>
          <p><strong>Price:</strong> $${tourData.price}</p>
          <p><strong>Date:</strong> ${tourData.date}</p>
        `;

        // Create the delete button dynamically
        const deleteButton = document.createElement("button");
        deleteButton.className = "removeBtn";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", async () => {
          await removeBooking(tourId, tourDetailsDiv); // Pass the tourDetailsDiv to the function
        });
        tourDetailsDiv.appendChild(deleteButton);
      } else {
        document.getElementById("tourDetails").innerHTML = "<p>No tour found with the given ID.</p>";
      }
    } catch (error) {
      console.error("Error fetching tour:", error);
      document.getElementById("tourDetails").innerHTML = "<p>Error fetching tour details. Please try again.</p>";
    }
  });
});

// Bind the removeBooking function to the window object
async function removeBooking(tourId, tourDetailsDiv) {
  const confirmation = confirm(`Are you sure you want to delete the booking with Tour ID: ${tourId}?`);
  if (confirmation) {
    try {
      // Reference to the document in the "tour" collection with the specified tour ID
      const docRef = doc(db, "tour", tourId);
      await deleteDoc(docRef);

      // Clear the displayed booking details from the UI
      tourDetailsDiv.innerHTML = "<p>The tour has been successfully deleted.</p>";
    } catch (error) {
      console.error("Error deleting tour:", error);
      alert("An error occurred while deleting the tour. Please try again.");
    }
  }
}
