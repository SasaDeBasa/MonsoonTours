// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCOm3GlA2_UgZhhHD_zDU9BRFwLnOLueEA",
    authDomain: "monsoontours-65f1e.firebaseapp.com",
    projectId: "monsoontours-65f1e",
    storageBucket: "monsoontours-65f1e",
    messagingSenderId: "378330088807",
    appId: "1:378330088807:web:217c00702fc17fea671bc2",
    measurementId: "G-L4V5MLH9KD"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const vehicleRef = db.collection("vehicles");


// Add Vehicle Function
document.getElementById("addVehicleForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const vehicleId = document.getElementById("vehicleId").value;
    const make = document.getElementById("make").value;
    const model = document.getElementById("model").value;
    const year = document.getElementById("year").value;
    const passengers = document.getElementById("passengers").value;
    const imageUrl = document.getElementById("imageUrl").value;

    try {
        // Check if the vehicle ID already exists
        const vehicleDoc = await vehicleRef.doc(vehicleId).get();
        if (vehicleDoc.exists) {
            alert("A vehicle with this ID already exists. Please use a different ID.");
            return; // Exit the function if the ID already exists
        }

        // Add the new vehicle if the ID does not exist
        await vehicleRef.doc(vehicleId).set({
            make: make,
            model: model,
            year: year,
            passengers: passengers,
            imageUrl: imageUrl,
            availability: true // Set availability to true initially
        });

        alert("Vehicle added successfully with availability set to true!");
        document.getElementById("addVehicleForm").reset();
    } catch (error) {
        console.error("Error adding vehicle: ", error);
    }
});



// Variables for Pagination
let currentPage = 1;
const entriesPerPage = 5; // 5 entries per page
let totalPages = 0;
let allVehicles = []; // To store all vehicle documents

// Function to Render Vehicles in the HTML Table (with pagination and availability dropdown)
function renderVehicleTable() {
    const table = document.getElementById("vehicleTable").getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear the table

    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, allVehicles.length);

    for (let i = startIndex; i < endIndex; i++) {
        const doc = allVehicles[i];
        const row = table.insertRow();

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);
        const cell7 = row.insertCell(6);
        const cell8 = row.insertCell(7);

        cell1.innerHTML = doc.id;
        cell2.innerHTML = doc.data().make;
        cell3.innerHTML = doc.data().model;
        cell4.innerHTML = doc.data().year;
        cell5.innerHTML = doc.data().passengers;

        // Display vehicle image
        if (doc.data().imageUrl) {
            cell6.innerHTML = `<img src="${doc.data().imageUrl}" alt="Vehicle Image" style="width:100px; height:auto;">`;
        } else {
            cell6.innerHTML = 'No Image';
        }

        // Availability Dropdown
        const availabilityDropdown = document.createElement('select');
        availabilityDropdown.innerHTML = `
            <option value="true" ${doc.data().availability ? 'selected' : ''}>Available</option>
            <option value="false" ${!doc.data().availability ? 'selected' : ''}>Not Available</option>
        `;
        cell7.appendChild(availabilityDropdown);

        // Update Button for Availability
        const updateButton = document.createElement('button');
        updateButton.textContent = "Update Availability";
        updateButton.setAttribute("data-id", doc.id); 
        cell8.appendChild(updateButton);

        // Add event listener for the Update button
        updateButton.addEventListener('click', async () => {
            const vehicleId = updateButton.getAttribute("data-id");
            const newAvailability = availabilityDropdown.value === 'true';

            try {
                await vehicleRef.doc(vehicleId).update({
                    availability: newAvailability
                });
                alert(`Vehicle ${vehicleId} availability updated!`);
            } catch (error) {
                console.error("Error updating availability: ", error);
            }
        });

        // Add Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("data-id", doc.id);
        deleteButton.classList.add('delete-btn');
        cell8.appendChild(deleteButton);

        // Add event listener for the Delete button
        deleteButton.addEventListener('click', async () => {
            const vehicleId = deleteButton.getAttribute("data-id");
            try {
                await vehicleRef.doc(vehicleId).delete();
                alert(`Vehicle ${vehicleId} deleted successfully!`);
                loadVehicles(); // Reload the vehicles after deletion
            } catch (error) {
                console.error("Error deleting vehicle: ", error);
            }
        });
    }

    updatePaginationControls(); // Update the pagination controls for the current page
}

// Function to update pagination controls
function updatePaginationControls() {
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    const pageNumber = document.getElementById("pageNumber");

    // Update page number display
    pageNumber.textContent = currentPage;

    // Enable/disable Prev button
    prevButton.disabled = currentPage === 1;

    // Enable/disable Next button
    nextButton.disabled = currentPage === totalPages;
}

// Event listeners for Pagination Buttons
document.getElementById("prevButton").addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderVehicleTable();
    }
});

document.getElementById("nextButton").addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderVehicleTable();
    }
});

// Real-time Listener for Vehicle Collection
function loadVehicles() {
    vehicleRef.onSnapshot((snapshot) => {
        allVehicles = [];
        snapshot.forEach((doc) => {
            allVehicles.push(doc);
        });

        totalPages = Math.ceil(allVehicles.length / entriesPerPage); // Calculate total pages
        renderVehicleTable(); // Render the table for the current page
    });
}

loadVehicles();

// --------------------------------------------------Report Generation------------------------------------------------------------------

// Function to fetch all vehicles from Firestore
async function fetchAllVehicles() {
    const allDocs = [];
    const snapshot = await vehicleRef.get();
    snapshot.forEach((doc) => {
        allDocs.push(doc);
    });
    return allDocs;
}

// Function to format and prepare data for Excel
async function prepareExcelData() {
    const allVehicles = await fetchAllVehicles();
    const data = [];
    
    // Prepare header row
    const headers = ["ID", "Make", "Model", "Year", "Passengers", "Availability"];
    data.push(headers);

    // Add vehicle data
    allVehicles.forEach((doc) => {
        const availability = doc.data().availability ? "Available" : "Not Available";
        data.push([
            doc.id,
            doc.data().make,
            doc.data().model,
            doc.data().year,
            doc.data().passengers,
            availability
        ]);
    });

    return data; // Return data for later use
}

// Event listener for Download Report button
document.getElementById("downloadReportBtn").addEventListener("click", async function() {
    const data = await prepareExcelData(); // Get data

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Vehicles');

    // Add title in the first row
    const title = worksheet.addRow(['Vehicle Report']);
    title.font = { bold: true, size: 16 }; // Title styling
    worksheet.mergeCells('A1:F1'); // Merge cells for the title
    title.alignment = { horizontal: 'center' }; // Center the title

    // Add header row with styling
    worksheet.addRow(data[0]).font = { bold: true };

    // Add vehicle data rows
    for (let i = 1; i < data.length; i++) {
        worksheet.addRow(data[i]);
    }

    // Set borders for all cells
    const borderStyle = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };

    worksheet.eachRow((row) => {
        row.eachCell((cell) => {
            cell.border = borderStyle;
        });
    });

    // Set column widths
    worksheet.columns.forEach(column => {
        column.width = 20; // Set a fixed width for all columns
    });

    // Download the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vehicle_report.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

