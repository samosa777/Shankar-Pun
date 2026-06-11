alert("dashboard.js loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Ensure only logged-in users see dashboard
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please login first.");
    window.location.href = "index.html";
    return;
  }

  // Fetch hotels from Firestore
  const hotelListElement = document.getElementById("hotelList");
  const totalHotelsElement = document.getElementById("totalHotels");
  const activeHotelsElement = document.getElementById("activeHotels");

  const hotelsSnapshot = await getDocs(collection(db, "hotels"));
  hotelListElement.innerHTML = ""; // Clear placeholder row

  let total = 0;
  let active = 0;

  hotelsSnapshot.forEach((doc) => {
    const hotel = doc.data();
    total++;

    if (hotel.status && hotel.status.toLowerCase() === "active") {
      active++;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${hotel.hotelName || "-"}</td>
      <td>${hotel.ownerName || "-"}</td>
      <td class="${hotel.status.toLowerCase() === "active" ? "status-active" : "status-inactive"}">
        ${hotel.status || "-"}
      </td>
    `;
    hotelListElement.appendChild(tr);
  });

  totalHotelsElement.textContent = total;
  activeHotelsElement.textContent = active;
});
