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

 // Reference to the packages collection in Firestore
 const packageCollectionRef = collection(db, 'packages');

 // Function to render the itinerary cards
 function renderItineraryCards(packageData) {
     const itineraryContainer = document.getElementById('itinerary-container');

     packageData.forEach((pkg, index) => {
         const packageCard = document.createElement('div');
         packageCard.classList.add('col-12', 'col-md-4', 'col-lg-3');
         packageCard.innerHTML = `
             <div class="itinerary-card">
                 <h5>${pkg.packageName}</h5>
                 <p>Duration: ${pkg.duration} days</p>
                 <p>Description: ${pkg.description}</p>
                 <p>No. of Locations: ${pkg.locations || 'N/A'}</p>
                 <button class="bookBtn" type="submit"><a style="color:white;" href="Tour.html">Read More</a></button>
             </div>
         `;
         itineraryContainer.appendChild(packageCard);
     });
 }

 // Fetch packages from Firestore and display them
 async function fetchAndDisplayPackages() {
     try {
         const querySnapshot = await getDocs(packageCollectionRef);
         const packageData = querySnapshot.docs.map(doc => doc.data());
         renderItineraryCards(packageData);
     } catch (error) {
         console.error('Error fetching packages:', error);
     }
 }

 // Fetch and display packages when the page loads
 fetchAndDisplayPackages();