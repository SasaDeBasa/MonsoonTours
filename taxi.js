 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
 import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";


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
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Function to fetch and display vehicles
async function displayVehicles() {
    const itineraryContainer = document.getElementById("itinerary-container");

    try {
        // Fetch data from Firestore
        const vehicleCollection = collection(db, "vehicles");
        const vehicleSnapshot = await getDocs(vehicleCollection);

        // Loop through each document
        vehicleSnapshot.forEach(doc => {
            const vehicleData = doc.data();
            const make = vehicleData.make;
            const model = vehicleData.model;
            const passengers = vehicleData.passengers;
            const imageUrl = vehicleData.imageUrl; // Get the image URL from the Firestore document

            // Fallback image in case imageUrl is not provided
            const vehicleImage = imageUrl || "assets/icons/default_vehicle_image.svg";

            // Create the vehicle card dynamically
            const cardHTML = `
                <div class="col-12 col-md-4 col-lg-3">
                    <div class="itinerary-card">
                        <h5>${make} ${model}</h5>
                        <img style="height: 100px;" src="${vehicleImage}" alt="Vehicle Image">
                        <p>No. of Passengers: ${passengers}</p>
                    </div>
                </div>
            `;

            // Append the new card to the container
            itineraryContainer.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error("Error fetching vehicles: ", error);
    }
}

// Call the function to fetch and display vehicles
displayVehicles();