import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

// Authentication Check
onAuthStateChanged(auth, async (user) => {
    if (!user || user.email !== "superadmin@power.com") {
        window.location.replace("index.html");
        return;
    }
    
    document.getElementById("authLoader").style.display = "none";

    // Load Hotels
    try {
        const snapshot = await getDocs(collection(db, "hotels"));
        let total = 0, active = 0;
        let html = "";
        
        snapshot.forEach((doc) => {
            const h = doc.data();
            total++;
            if(h.status && h.status.toLowerCase() === "active") active++;
            
            html += `<tr>
                <td><a href="hotel-details.html?id=${doc.id}" class="hotel-link">${h.hotelName || "Unnamed Entity"}</a></td>
                <td>${h.ownerName || "N/A"}</td>
                <td><span class="badge-active">${h.status || "UNKNOWN"}</span></td>
            </tr>`;
        });

        document.getElementById("totalHotels").innerText = total;
        document.getElementById("activeHotels").innerText = active;
        document.getElementById("hotelList").innerHTML = total === 0 ? `<tr><td colspan="3">No records found.</td></tr>` : html;
        
    } catch (error) {
        alert("Data Retrieval Failed: " + error.message);
    }
});

// Logout Logic Fix
const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        signOut(auth).then(() => {
            window.location.replace("index.html");
        }).catch((error) => {
            alert("Error logging out: " + error.message);
        });
    });
}