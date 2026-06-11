import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBkRWPYZtmjS-lpiojtNtY_6h4IORZ6xjc",
  authDomain: "hotel-menu-f25ed.firebaseapp.com",
  projectId: "hotel-menu-f25ed",
  storageBucket: "hotel-menu-f25ed.firebasestorage.app",
  messagingSenderId: "750886705933",
  appId: "1:750886705933:web:c3331f1dd8cfc99342ee44"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Security: only logged-in user
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login first");
    window.location.href = "index.html";
  }
});

// Button click
document.getElementById("createHotelBtn").addEventListener("click", async () => {
  try {

    const data = {
      hotelName: document.getElementById("hotelName").value,
      ownerName: document.getElementById("ownerName").value,
      mobile: document.getElementById("mobile").value,
      whatsapp: document.getElementById("whatsapp").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value, // later hash karna chahiye
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      country: document.getElementById("country").value,
      maps: document.getElementById("maps").value,
      website: document.getElementById("website").value,
      facebook: document.getElementById("facebook").value,
      instagram: document.getElementById("instagram").value,
      plan: document.getElementById("plan").value,
      startDate: document.getElementById("startDate").value,
      status: document.getElementById("status").value,

      createdAt: serverTimestamp(),
      createdBy: auth.currentUser ? auth.currentUser.uid : null
    };

    // Validation
    if (!data.hotelName || !data.ownerName || !data.email || !data.password) {
      alert("Please fill required fields");
      return;
    }

    await addDoc(collection(db, "hotels"), data);

    alert("Hotel Created Successfully 🚀");

    // Reset form
    document.querySelectorAll("input, textarea").forEach(el => el.value = "");

  } catch (error) {
    alert("Error: " + error.message);
    console.log(error);
  }
});
