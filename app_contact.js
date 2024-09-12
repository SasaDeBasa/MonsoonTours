// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCOm3GlA2_UgZhhHD_zDU9BRFwLnOLueEA",
    authDomain: "monsoontours-65f1e.firebaseapp.com",
    projectId: "monsoontours-65f1e",
    storageBucket: "monsoontours-65f1e.appspot.com",
    messagingSenderId: "378330088807",
    appId: "1:378330088807:web:217c00702fc17fea671bc2",
    measurementId: "G-L4V5MLH9KD"
};

// Initialize Firebase App
firebase.initializeApp(firebaseConfig);

// Initialize EmailJS with the User ID for acc1 (sending email)
emailjs.init("x5DF0-RSt3jTJ9Ytr"); // Replace with your actual User ID for acc1 from EmailJS dashboard

// Function to send the email when the form is submitted
document.querySelector("#contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form default submission

    // Get form values
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const message = document.querySelector('#message').value;

    // Prepare email template parameters
    const templateParams = {
        user_name: name,
        user_email: email,
        message: message,
        recipient_email: "carcarerepairservices@gmail.com" // This is the recipient's email (acc2)
    };

    // Send the email using EmailJS
    emailjs.send("service_ldz9bt2", "template_rxkn98j", templateParams)
    .then(function(response) {
        alert("Message sent successfully!");
    }, function(error) {
        console.error("Failed to send message: ", error);
        alert("Failed to send message. Please try again.");
    });
});
