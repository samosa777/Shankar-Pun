import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

const params = new URLSearchParams(window.location.search);
const hotelId = params.get("id");

onAuthStateChanged(auth, async (user) => {
    if (!user || user.email !== "superadmin@power.com") {
        window.location.href = "index.html";
        return;
    }
    
    document.getElementById("authLoader").style.display = "none";
    
    if (!hotelId) {
        alert("Invalid Hotel ID.");
        window.location.href = "dashboard.html";
        return;
    }

    try {
        const hotelRef = doc(db, "hotels", hotelId);
        const docSnap = await getDoc(hotelRef);

        if (docSnap.exists()) {
            const h = docSnap.data();
            
            // Populating UI fields
            if(document.getElementById("v_hotelName")) document.getElementById("v_hotelName").value = h.hotelName || "";
            if(document.getElementById("v_ownerName")) document.getElementById("v_ownerName").value = h.ownerName || "";
            if(document.getElementById("v_email")) document.getElementById("v_email").value = h.email || "";
            if(document.getElementById("v_mobile")) document.getElementById("v_mobile").value = h.mobile || "";
            if(document.getElementById("v_status")) document.getElementById("v_status").value = h.status || "";
            if(document.getElementById("v_plan")) document.getElementById("v_plan").value = h.plan || "";

            // Setting up QR Code
            const menuUrl = window.location.origin + "/menu.html?id=" + hotelId;
            document.getElementById("menuLink").innerText = menuUrl;
            document.getElementById("menuLink").href = menuUrl;
            document.getElementById("qrImage").src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(menuUrl);
            
        } else {
            alert("No such entity found!");
            window.location.href = "dashboard.html";
        }
    } catch (error) {
        console.error(error);
        alert("Error loading data: " + error.message);
    }
});