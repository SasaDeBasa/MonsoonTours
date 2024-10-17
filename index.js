const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase admin SDK
admin.initializeApp();

// Configure your email credentials
const gmailEmail = 'monsoonemailsup@gmail.com';  // Your Gmail address
const gmailPassword = 'Triyon123';  // Your Gmail app password (App Password)

// Create a Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

// Cloud Function to send email on new Firestore document creation
exports.sendContactEmail = functions.firestore
    .document('contacts/{docId}')
    .onCreate((snap, context) => {
        const contactData = snap.data();

        // Set up the email options
        const mailOptions = {
            from: gmailEmail,
            to: 'carcarerepairservices@gmail.com',  // Change to the email where you want to receive messages
            subject: `New Contact Form Submission from ${contactData.name}`,
            html: `<p>You have a new contact form submission:</p>
                   <p><strong>Name:</strong> ${contactData.name}</p>
                   <p><strong>Email:</strong> ${contactData.email}</p>
                   <p><strong>Message:</strong> ${contactData.message}</p>`,
        };

        // Send the email
        return transporter.sendMail(mailOptions)
            .then(() => console.log('Email sent successfully'))
            .catch((error) => console.error('Error sending email:', error));
    });
