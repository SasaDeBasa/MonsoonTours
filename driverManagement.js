// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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

const driverCollectionRef = collection(db, 'drivers');  // Firestore collection reference

// Function to add or update a driver in Firestore
async function addOrUpdateDriver(nic, name, phone) {
    try {
        await setDoc(doc(driverCollectionRef, nic), {
            name: name,
            phone: phone
        });
        alert(`Driver ${nic} saved successfully!`);
        fetchAndDisplayDrivers();  // Refresh the table after adding or updating
    } catch (error) {
        console.error('Error saving driver:', error);
    }
}

// Function to delete a driver from Firestore
async function deleteDriver(nic) {
    try {
        await deleteDoc(doc(driverCollectionRef, nic));
        alert(`Driver ${nic} deleted successfully!`);
        fetchAndDisplayDrivers();  // Refresh the table after deletion
    } catch (error) {
        console.error('Error deleting driver:', error);
    }
}

// Function to fetch drivers and render them in the table
async function fetchAndDisplayDrivers() {
    const tableBody = document.querySelector('#driverTable tbody');
    tableBody.innerHTML = '';  // Clear the table first

    // Add the input row for new drivers
    const inputRow = `
        <tr>
            <td><input type="text" id="nicInput" placeholder="Enter NIC"></td>
            <td><input type="text" id="nameInput" placeholder="Enter Name"></td>
            <td><input type="tel" id="phoneInput" placeholder="Enter Phone Number"></td>
            <td><button id="saveBtn">Save Changes</button></td>
        </tr>`;
    tableBody.insertAdjacentHTML('beforeend', inputRow);

    // Add event listener to the Save Changes button
    document.getElementById('saveBtn').addEventListener('click', () => {
        const nic = document.getElementById('nicInput').value;
        const name = document.getElementById('nameInput').value;
        const phone = document.getElementById('phoneInput').value;

        if (nic && name && phone) {
            addOrUpdateDriver(nic, name, phone);
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Fetch existing drivers from Firestore
    try {
        const querySnapshot = await getDocs(driverCollectionRef);
        querySnapshot.forEach((doc) => {
            const driver = doc.data();
            const driverRow = `
                <tr>
                    <td><input type="text" value="${doc.id}" data-nic="${doc.id}" class="nic-input" disabled></td>
                    <td><input type="text" value="${driver.name}" class="name-input"></td>
                    <td><input type="tel" value="${driver.phone}" class="phone-input"></td>
                    <td>
                        <button class="updateBtn" data-id="${doc.id}">Update</button>
                        <button class="deleteBtn" data-id="${doc.id}">Delete</button>
                    </td>
                </tr>`;
            tableBody.insertAdjacentHTML('beforeend', driverRow);
        });

        // Add event listeners for the update and delete buttons
        document.querySelectorAll('.updateBtn').forEach(button => {
            button.addEventListener('click', () => {
                const nic = button.getAttribute('data-id');
                const name = button.closest('tr').querySelector('.name-input').value;
                const phone = button.closest('tr').querySelector('.phone-input').value;

                if (name && phone) {
                    addOrUpdateDriver(nic, name, phone);  // Update the driver in Firestore
                } else {
                    alert('Please fill in all fields to update.');
                }
            });
        });

        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', () => {
                const nic = button.getAttribute('data-id');
                deleteDriver(nic);
            });
        });
    } catch (error) {
        console.error('Error fetching drivers:', error);
    }
}

// Function to download the table as an Excel file (updated)
function downloadTableAsExcel() {
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');
    
    // Create table header
    const headerRow = `
        <tr>
            <th>NIC</th>
            <th>Name</th>
            <th>Phone</th>
        </tr>`;
    tableBody.insertAdjacentHTML('beforeend', headerRow);

    // Loop through each row in the displayed table and extract input values
    document.querySelectorAll('#driverTable tbody tr').forEach(row => {
        const nic = row.querySelector('.nic-input') ? row.querySelector('.nic-input').value : '';
        const name = row.querySelector('.name-input') ? row.querySelector('.name-input').value : '';
        const phone = row.querySelector('.phone-input') ? row.querySelector('.phone-input').value : '';

        // Create a new row in the download table with the extracted values
        const newRow = `
            <tr>
                <td>${nic}</td>
                <td>${name}</td>
                <td>${phone}</td>
            </tr>`;
        tableBody.insertAdjacentHTML('beforeend', newRow);
    });

    table.appendChild(tableBody);

    // Convert the clean table to a worksheet and download it as an Excel file
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");
    XLSX.writeFile(workbook, "drivers.xlsx");
}

// Fetch and display drivers when the page loads
fetchAndDisplayDrivers();

// Add the "Download as Excel" button
document.querySelector("#downloadBtn").addEventListener('click', downloadTableAsExcel);
