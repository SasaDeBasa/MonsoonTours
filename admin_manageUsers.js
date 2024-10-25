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
                    <td>${userData.username || userData.displayName || 'Unknown'}</td>
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


////----------------------------------------------------------Report Generation---------------------------------------------


// Function to download the user table as an Excel file
async function downloadUsersAsExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // Add title
    worksheet.addRow(['User Information']);
    worksheet.mergeCells('A1:C1'); // Merge cells for the title
    worksheet.getCell('A1').font = { size: 16, bold: true }; // Style the title

    // Create table header
    const headerRow = ['Username', 'Email', 'Contact'];
    worksheet.addRow(headerRow);

    // Set header styles
    headerRow.forEach((_, index) => {
        worksheet.getCell(2, index + 1).font = { bold: true };
        worksheet.getCell(2, index + 1).border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    // Loop through each row in the displayed table and extract values
    document.querySelectorAll('#UserTable tbody tr').forEach(row => {
        const username = row.querySelector('td:nth-child(1)') ? row.querySelector('td:nth-child(1)').innerText : '';
        const email = row.querySelector('td:nth-child(2)') ? row.querySelector('td:nth-child(2)').innerText : '';
        const contact = row.querySelector('td:nth-child(3)') ? row.querySelector('td:nth-child(3)').innerText : '';

        // Create a new row in the download table with the extracted values
        worksheet.addRow([username, email, contact]);
    });

    // Set the styles for each cell in the body
    const rowCount = worksheet.rowCount;
    for (let i = 3; i <= rowCount; i++) { // Start from the 3rd row (after title and header)
        for (let j = 1; j <= 3; j++) {
            worksheet.getCell(i, j).border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' }
            };
        }
    }

    // Download the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'UsersData.xlsx';
    link.click();
}

// Add event listener to the export button
document.getElementById('exportButton').addEventListener('click', downloadUsersAsExcel);


//----------------------------------------------------------------------------------------------------------------------------------------

// Fetch and display users when the page loads
fetchAndDisplayUsers();
