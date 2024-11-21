// taxiBooking.js

// Get references to the popup elements
const popup = document.getElementById('popup');
const closePopup = document.querySelector('.close-popup');
const confirmButton = document.querySelector('.btn-custom');

// Get references to the form fields
const startLocationInput = document.getElementById('start-location');
const endLocationInput = document.getElementById('end-location');

// Function to open the popup
export function openPopup() {
    popup.style.display = 'block';
}

// Function to close the popup
function closeBookingPopup() {
    popup.style.display = 'none';
}

// Function to handle the taxi booking logic
function handleTaxiBooking() {
    const startLocation = startLocationInput.value;
    const endLocation = endLocationInput.value;

    if (startLocation && endLocation) {
        // Here, we can send the booking data to Firebase or perform other actions
        console.log(`Booking Taxi from ${startLocation} to ${endLocation}`);

        // Clear input fields after submission
        startLocationInput.value = '';
        endLocationInput.value = '';

        // Close the popup after booking
        closeBookingPopup();

        // Optionally, show a success message or confirmation (can be implemented here)
        alert('Taxi booking confirmed!');
    } else {
        alert('Please fill in both start and end locations.');
    }
}

// Event listener to close the popup when the 'X' is clicked
closePopup.addEventListener('click', closeBookingPopup);

// Event listener for the Confirm Booking button
confirmButton.addEventListener('click', handleTaxiBooking);

// Export the close function if needed
export { closeBookingPopup };
