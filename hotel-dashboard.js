import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyBkRWPYZtmjS-lpiojtNtY_6h4IORZ6xjc", authDomain: "hotel-menu-f25ed.firebaseapp.com", projectId: "hotel-menu-f25ed", storageBucket: "hotel-menu-f25ed.firebasestorage.app", messagingSenderId: "750886705933", appId: "1:750886705933:web:c3331f1dd8cfc99342ee44" };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Custom Session Setup (Database Login)
const loggedInEmail = localStorage.getItem("hotelUserEmail");

// 5-Min Timer Auto Logout
let logoutTimer;
function resetTimer() { 
    clearTimeout(logoutTimer); 
    logoutTimer = setTimeout(() => { 
        localStorage.removeItem("hotelUserEmail"); 
        window.location.href = "index.html"; 
    }, 300000); 
}
window.onload = resetTimer; window.onmousemove = resetTimer; window.onkeypress = resetTimer;

async function checkAccess() {
    if(!loggedInEmail){ window.location.href="index.html"; return; }
    
    // Check Status Security directly from DB
    const q = query(collection(db, "hotels"), where("email", "==", loggedInEmail));
    const snap = await getDocs(q);
    
    if(!snap.empty) {
        const h = snap.docs[0].data();
        if(h.status === "Inactive") {
            alert("Account Suspended by Super Admin.");
            localStorage.removeItem("hotelUserEmail");
            window.location.href = "index.html";
            return;
        }

        document.getElementById("authLoader").style.display = "none";
        document.getElementById("welcomeText").innerText = "Welcome, " + (h.ownerName || "Director");
        document.getElementById("hotelName").innerText = h.hotelName || "Entity";
        
        ["pHotel", "pOwner", "pEmail", "pMobile", "pCity", "pAddress", "pPlan"].forEach(id => {
            let key = id.substring(1).toLowerCase();
            if(key === 'hotel') key = 'hotelName';
            if(key === 'owner') key = 'ownerName';
            if(document.getElementById(id)) document.getElementById(id).innerText = h[key] || "N/A";
        });
    } else {
        localStorage.removeItem("hotelUserEmail");
        window.location.href = "index.html";
    }
}

checkAccess();

document.getElementById("userLogoutBtn").addEventListener("click", () => {
    localStorage.removeItem("hotelUserEmail");
    window.location.href = "index.html";
});