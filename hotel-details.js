import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const params = new URLSearchParams(window.location.search);
const hotelId = params.get("id");

if (!hotelId) {
  alert("Hotel ID Missing");
  window.location.href = "dashboard.html";
}

loadHotel();

async function loadHotel() {

  try {

    const hotelRef = doc(db, "hotels", hotelId);

    const hotelSnap = await getDoc(hotelRef);

    if (!hotelSnap.exists()) {

      alert("Hotel Not Found");
      window.location.href = "dashboard.html";
      return;

    }

    const hotel = hotelSnap.data();

    document.getElementById("hotelName").innerText =
      hotel.hotelName || "Hotel";

    document.getElementById("ownerName").innerText =
      hotel.ownerName || "-";

    document.getElementById("email").innerText =
      hotel.email || "-";

    document.getElementById("mobile").innerText =
      hotel.mobile || "-";

    document.getElementById("whatsapp").innerText =
      hotel.whatsapp || "-";

    document.getElementById("city").innerText =
      hotel.city || "-";

    document.getElementById("country").innerText =
      hotel.country || "-";

    document.getElementById("address").innerText =
      hotel.address || "-";

    document.getElementById("plan").innerText =
      hotel.plan || "-";

    const menuUrl =
      window.location.origin +
      "/menu.html?id=" +
      hotelId;

    document.getElementById("menuLink").innerText =
      menuUrl;

    document.getElementById("qrImage").src =
      "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" +
      encodeURIComponent(menuUrl);

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

}

document
.getElementById("uploadBtn")
.addEventListener("click", () => {

  const file =
    document.getElementById("menuFile").files[0];

  if (!file) {

    alert("Please select a file");
    return;

  }

  alert(
    "Menu Upload System will be connected in next step.\n\nSelected File:\n" +
    file.name
  );

});

console.log("Hotel Details Loaded");