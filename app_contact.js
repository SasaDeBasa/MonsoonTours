// Initialize EmailJS with your user ID (public key)
(function () {
    emailjs.init("IZd13W-hrfkKHyqNL"); // Replace with your actual EmailJS public key (User ID)
})();

// Initialize Firebase (optional, if you're using Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyCOm3GlA2_UgZhhHD_zDU9BRFwLnOLueEA",
    authDomain: "monsoontours-65f1e.firebaseapp.com",
    projectId: "monsoontours-65f1e",
    storageBucket: "monsoontours-65f1e.appspot.com",
    messagingSenderId: "378330088807",
    appId: "1:378330088807:web:217c00702fc17fea671bc2",
    measurementId: "G-L4V5MLH9KD"
};

// Initialize Firebase (if needed, otherwise comment this part)
firebase.initializeApp(firebaseConfig);

// Function to handle form submission
document.querySelector("#contactForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission from refreshing the page

    // Get form values
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const message = document.querySelector("#message").value;

    // Prepare email parameters for EmailJS
    const templateParams = {
        user_name: name,
        user_email: email,
        message: message,
        recipient_email: "carcarerepairservices@gmail.com" // Replace with your recipient email
    };

    // Disable send button during submission
    const sendMessageBtn = document.querySelector(".sendMessageBtn");
    sendMessageBtn.disabled = true;

    // Send the email using EmailJS
    emailjs.send("service_ldz9bt2", "template_rxkn98j", templateParams)
        .then(function (response) {
            alert("Message sent successfully!");
            sendMessageBtn.disabled = false; // Re-enable the button after success

            // Optionally, clear the form after successful submission
            document.querySelector("#contactForm").reset();
        }, function (error) {
            console.error("Failed to send message: ", error);
            alert("Failed to send message. Please try again.");
            sendMessageBtn.disabled = false; // Re-enable the button after failure
        });
});
