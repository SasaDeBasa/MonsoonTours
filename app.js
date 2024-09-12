 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 // Firebase initialization (replace with your Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyCOm3GlA2_UgZhhHD_zDU9BRFwLnOLueEA",
    authDomain: "monsoontours-65f1e.firebaseapp.com",
    projectId: "monsoontours-65f1e",
    storageBucket: "monsoontours-65f1e.appspot.com",
    messagingSenderId: "378330088807",
    appId: "1:378330088807:web:217c00702fc17fea671bc2",
    measurementId: "G-L4V5MLH9KD"
  };
  
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Reference to the vehicles collection
  const vehicleRef = db.collection("vehicles");
  
  //Reference to the tour collection
  const tourRef = db.collection("tour").doc("tourId");

  // Add Vehicle Function
  document.getElementById("addVehicleForm").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const vehicleId = document.getElementById("vehicleId").value;
    const make = document.getElementById("make").value;
    const model = document.getElementById("model").value;
    const year = document.getElementById("year").value;
  
    try {
      await vehicleRef.doc(vehicleId).set({
        make: make,
        model: model,
        year: year
      });
      alert("Vehicle added successfully!");
      document.getElementById("addVehicleForm").reset(); // Clear form fields
    } catch (error) {
      console.error("Error adding vehicle: ", error);
    }
  });
  
  // Function to Render Vehicles in the HTML Table
  function renderVehicleTable(doc) {
    const table = document.getElementById("vehicleTable").getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);
  
    cell1.innerHTML = doc.id;
    cell2.innerHTML = doc.data().make;
    cell3.innerHTML = doc.data().model;
    cell4.innerHTML = doc.data().year;

     // Create and append the delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("data-id", doc.id); // Set the vehicle document ID
    deleteButton.classList.add('delete-btn'); // Add a class for styling if needed
    cell5.appendChild(deleteButton);

    deleteButton.addEventListener('click', async () => {
      const vehicleId = deleteButton.getAttribute("data-id");
      try {
        await vehicleRef.doc(vehicleId).delete(); // Delete the document from Firestore
        alert(`Vehicle ${vehicleId} deleted successfully!`);
      } catch (error) {
        console.error("Error deleting vehicle: ", error);
      }
    });
  }
  
  // Real-time Listener for Vehicle Collection
  vehicleRef.onSnapshot((snapshot) => {
    const tableBody = document.getElementById("vehicleTable").getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear the table first
  
    snapshot.forEach((doc) => {
      renderVehicleTable(doc);
    });
  });

   // Initialize Firebase
   
   const analytics = getAnalytics(app);

   //Home


   //Taxi


   //Tour
  // Function to handle fetching tour details
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('bookTourForm').addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent form from submitting normally

      // Get the tour ID input value
      const tourId = document.getElementById('tourId').value;

      try {
          // Reference to the document in the "tour" collection with the specified tour ID
          const docRef = doc(db, "tour", tourId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
              // Display the tour details in the designated area
              const tourData = docSnap.data();
              document.getElementById('tourDetails').innerHTML = `
                  <h4>Tour Details</h4>
                  <p><strong>Name:</strong> ${tourData.name}</p>
                  <p><strong>Description:</strong> ${tourData.description}</p>
                  <p><strong>Price:</strong> $${tourData.price}</p>
                  <p><strong>Date:</strong> ${tourData.date}</p>
              `;
          } else {
              // If no tour is found with the provided ID
              document.getElementById('tourDetails').innerHTML = '<p>No tour found with the given ID.</p>';
          }
      } catch (error) {
          console.error('Error fetching tour:', error);
          document.getElementById('tourDetails').innerHTML = '<p>Error fetching tour details. Please try again.</p>';
      }
    });
  });
   //Contact
   //Profile
   //Login
   //Register
   
  