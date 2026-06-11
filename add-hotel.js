import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBkRWPYZtmjS-lpiojtNtY_6h4IORZ6xjc",
  authDomain: "hotel-menu-f25ed.firebaseapp.com",
  projectId: "hotel-menu-f25ed",
  storageBucket: "hotel-menu-f25ed.firebasestorage.app",
  messagingSenderId: "750886705933",
  appId: "1:750886705933:web:c3331f1dd8cfc99342ee44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Only logged-in users can add hotels
onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Please login first.");
    window.location.href = "index.html";
  }
});

const addBtn = document.querySelector("button");

addBtn.addEventListener("click", async () => {
  const hotelName = document.querySelector('input[placeholder="Hotel Name"]').value;
  const ownerName = document.querySelector('input[placeholder="Owner Name"]').value;
  const mobile = document.querySelector('input[placeholder="Mobile Number"]').value;
  const whatsapp = document.querySelector('input[placeholder="WhatsApp Number"]').value;
  const email = document.querySelector('input[placeholder="Login Email"]').value;
  const password = document.querySelector('input[placeholder="Login Password"]').value;
  const address = document.querySelector('textarea[placeholder="Full Hotel Address"]').value;
  const city = document.querySelector('input[placeholder="City"]').value;
  const state = document.querySelector('input[placeholder="State"]').value;
  const country = document.querySelector('input[placeholder="Country"]').value;
  const maps = document.querySelector('input[placeholder="Google Maps Link"]').value;
  const website = document.querySelector('input[placeholder="Website URL"]').value;
  const facebook = document.querySelector('input[placeholder="Facebook Page URL"]').value;
  const instagram = document.querySelector('input[placeholder="Instagram Page URL"]').value;
  const plan = document.querySelector('select').value;
  const startDate = document.querySelector('input[type="date"]').value;
  const status = document.querySelector('select.full').value;

  if (!hotelName || !ownerName || !mobile || !email) {
    alert("Please fill all required fields!");
    return;
  }

  try {
    await addDoc(collection(db, "hotels"), {
      hotelName,
      ownerName,
      mobile,
      whatsapp,
      email,
      password, // production me hashing karna
      address,
      city,
      state,
      country,
      maps,
      website,
      facebook,
      instagram,
      subscriptionPlan: plan,
      startDate,
      status,
      createdAt: serverTimestamp(),
      createdBy: auth.currentUser.uid
    });
    alert("Hotel Added Successfully!");
    window.location.reload();
  } catch (error) {
    console.error(error);
    alert("Error adding hotel: " + error.message);
  }
});