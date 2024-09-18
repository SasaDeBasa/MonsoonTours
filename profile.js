// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCOm3GlA2_UgZhhHD_zDU9BRFwLnOLueEA",
  authDomain: "monsoontours-65f1e.firebaseapp.com",
  projectId: "monsoontours-65f1e",
  storageBucket: "monsoontours-65f1e.appspot.com",
  messagingSenderId: "378330088807",
  appId: "1:378330088807:web:217c00702fc17fea671bc2",
  measurementId: "G-L4V5MLH9KD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const profileName = document.getElementById("ProfileName");
const profileEmail = document.getElementById("ProfileEmail");
const profileContact = document.getElementById("ProfileContact");
const profilePic = document.getElementById("ProfileUser");
const editIcons = document.querySelectorAll(".edit-icon");

// User info loading
onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, "user", user.uid);
      const docSnap = await getDoc(userRef);
  
      if (docSnap.exists()) {
        // If the user signed up with Google
        if (user.providerData[0].providerId === "google.com") {
          profileName.textContent = docSnap.data().displayName || "N/A";
          profileEmail.textContent = docSnap.data().email;
          profileContact.textContent = "N/A";  // Google users may not have contact info
          profilePic.src = docSnap.data().photoURL || "assets/icons/user.svg";  // Update profile picture
        } else {
          // For regular registration
          profileName.textContent = docSnap.data().username || "N/A";
          profileEmail.textContent = docSnap.data().email;
          profileContact.textContent = docSnap.data().contact || "N/A";
          profilePic.src = "assets/icons/user.svg";  // Default icon for non-Google users
        }
      }
    }
  });
  

// Allow editing profile info
editIcons.forEach((icon) => {
  icon.addEventListener("click", (e) => {
    const field = e.target.previousElementSibling;
    const currentValue = field.textContent;
    const input = prompt("Edit this field:", currentValue);

    if (input !== null) {
      field.textContent = input;
      saveProfileChanges(e.target.dataset.field, input);  // Save changes
    }
  });
});

// Save profile changes
async function saveProfileChanges(field, value) {
  const user = auth.currentUser;
  const userRef = doc(db, "user", user.uid);

  // Update Firestore based on the field being edited
  const updates = {};
  updates[field] = value;

  await updateDoc(userRef, updates);

  // If the field is 'displayName', update Firebase Auth profile too
  if (field === "displayName" || field === "username") {
    await updateProfile(user, {
      displayName: value
    });
  }
}
