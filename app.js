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
      const imageUrl = document.getElementById("imageUrl").value; // Get the image URL from the form
  
      try {
          await vehicleRef.doc(vehicleId).set({
              make: make,
              model: model,
              year: year,
              passengers: passengers,
              imageUrl: imageUrl, // Store the image URL in Firestore
              availability: true // Set availability to true initially
          });
          
          alert("Vehicle added successfully with availability set to true!");
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
      const cell6 = row.insertCell(5);
      const cell7 = row.insertCell(6);
  
      cell1.innerHTML = doc.id;
      cell2.innerHTML = doc.data().make;
      cell3.innerHTML = doc.data().model;
      cell4.innerHTML = doc.data().year;
      cell5.innerHTML = doc.data().passengers;
      
      if (doc.data().imageUrl) {
          cell6.innerHTML = `<img src="${doc.data().imageUrl}" alt="Vehicle Image" style="width:100px; height:auto;">`;
      } else {
          cell6.innerHTML = 'No Image';
      }
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("data-id", doc.id); 
      deleteButton.classList.add('delete-btn'); 
      cell7.appendChild(deleteButton);
  
      deleteButton.addEventListener('click', async () => {
          const vehicleId = deleteButton.getAttribute("data-id");
          try {
              await vehicleRef.doc(vehicleId).delete(); 
              alert(`Vehicle ${vehicleId} deleted successfully!`);
          } catch (error) {
              console.error("Error deleting vehicle: ", error);
          }
      });
  }

  // Real-time Listener for Vehicle Collection
  vehicleRef.onSnapshot((snapshot) => {
      const tableBody = document.getElementById("vehicleTable").getElementsByTagName('tbody')[0];
      tableBody.innerHTML = ''; 

      snapshot.forEach((doc) => {
          renderVehicleTable(doc);
      });
  });

  // Function to convert HTML table to JSON for Excel export
  function tableToJson(table) {
      const data = [];
      const headers = [];

      // Get the table headers
      for (let i = 0; i < table.rows[0].cells.length; i++) {
          headers[i] = table.rows[0].cells[i].innerText;
      }

      // Loop through each row in the table
      for (let i = 1; i < table.rows.length; i++) {
          const tableRow = table.rows[i];
          const rowData = {};

          for (let j = 0; j < tableRow.cells.length; j++) {
              rowData[headers[j]] = tableRow.cells[j].innerText;
          }
          data.push(rowData);
      }

      return data;
  }

  // Event listener for Download Report button
  document.getElementById("downloadReportBtn").addEventListener("click", function() {
      const table = document.getElementById("vehicleTable");
      const data = tableToJson(table); // Convert table to JSON
      
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Convert JSON to a worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Vehicles");

      // Download the Excel file
      XLSX.writeFile(wb, "vehicle_report.xlsx");
  });