// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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

// Function to fetch and display all users
async function fetchAndDisplayUsers() {
    const usersRef = collection(db, 'user');
    const usersTableBody = document.querySelector("#UserTable tbody");
    usersTableBody.innerHTML = ''; // Clear existing rows

    try {
        const querySnapshot = await getDocs(usersRef);
        console.log('Fetched users:', querySnapshot.docs.length); // Log number of users fetched
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            console.log('User data:', userData); // Log each user's data
            const userRow = document.createElement('tr');
            userRow.innerHTML = `
                <td>${userData.username || 'Unknown'}</td>
                <td>${userData.email || 'N/A'}</td>
                <td>${userData.contact || 'N/A'}</td>
            `;
            usersTableBody.appendChild(userRow);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}


// Function to search users by UID
async function searchUserByUID(uid) {
    const usersRef = collection(db, 'user');
    const usersTableBody = document.querySelector("#UserTable tbody");
    usersTableBody.innerHTML = ''; // Clear existing rows

    try {
        const querySnapshot = await getDocs(usersRef);
        querySnapshot.forEach((doc) => {
            if (doc.id === uid) {
                const userData = doc.data();
                const userRow = document.createElement('tr');
                userRow.innerHTML = `
                    <td>${userData.username || 'Unknown'}</td>
                    <td>${userData.email || 'N/A'}</td>
                    <td>${userData.contact || 'N/A'}</td>
                `;
                usersTableBody.appendChild(userRow);
            }
        });
    } catch (error) {
        console.error('Error searching for user:', error);
    }
}

// Event listener for search button
document.getElementById('searchButton').addEventListener('click', () => {
    const uid = document.getElementById('uidSearch').value.trim();
    if (uid) {
        searchUserByUID(uid);
    } else {
        fetchAndDisplayUsers(); // If search box is empty, show all users
    }
});

// Fetch and display users when the page loads
fetchAndDisplayUsers();
