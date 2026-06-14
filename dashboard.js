import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

console.log("Dashboard JS Loaded");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    alert("Please login first");
    window.location.href = "index.html";
    return;
  }

  try {

    const hotelList = document.getElementById("hotelList");
    const totalHotelsElement = document.getElementById("totalHotels");
    const activeHotelsElement = document.getElementById("activeHotels");

    hotelList.innerHTML = "";

    const snapshot = await getDocs(
      collection(db, "hotels")
    );

    console.log("Hotels Found:", snapshot.size);

    let totalHotels = 0;
    let activeHotels = 0;

    snapshot.forEach((doc) => {

      const hotel = doc.data();

      totalHotels++;

      if (
        hotel.status &&
        hotel.status.toLowerCase() === "active"
      ) {
        activeHotels++;
      }

      hotelList.innerHTML += `
<tr>
<td>
<a
href="hotel-details.html?id=${doc.id}"
style="
color:#f59e0b;
font-weight:bold;
text-decoration:none;
">
${hotel.hotelName || "-"}
</a>
</td>

<td>${hotel.ownerName || "-"}</td>

<td>${hotel.status || "-"}</td>

</tr>
`;

    });

    totalHotelsElement.innerText = totalHotels;
    activeHotelsElement.innerText = activeHotels;

    if (totalHotels === 0) {

      hotelList.innerHTML = `
        <tr>
          <td>No Hotels Found</td>
          <td>-</td>
          <td>-</td>
        </tr>
      `;

    }

  } catch (error) {

    console.error("Firestore Error:", error);

    alert(
      "Dashboard Error: " + error.message
    );

  }

});
