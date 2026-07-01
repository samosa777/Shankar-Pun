import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = { 
    apiKey: "AIzaSyBkRWPYZtmjS-lpiojtNtY_6h4IORZ6xjc", 
    authDomain: "hotel-menu-f25ed.firebaseapp.com", 
    projectId: "hotel-menu-f25ed", 
    storageBucket: "hotel-menu-f25ed.firebasestorage.app", 
    messagingSenderId: "750886705933", 
    appId: "1:750886705933:web:c3331f1dd8cfc99342ee44" 
};

// Initialize Firebase Application
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Custom Session Setup (Database Login)
const loggedInEmail = localStorage.getItem("hotelUserEmail");

// 5-Minute Timer Auto Logout for Security
let logoutTimer;
function resetTimer() { 
    clearTimeout(logoutTimer); 
    logoutTimer = setTimeout(() => { 
        localStorage.removeItem("hotelUserEmail"); 
        window.location.href = "index.html"; 
    }, 300000); 
}

// Attach timer resets to user interactions (Including mobile touch events)
window.onload = resetTimer; 
window.onmousemove = resetTimer; 
window.onkeypress = resetTimer;
window.ontouchstart = resetTimer; // Added specifically for Mobile devices

async function checkAccess() {
    // If no session exists, redirect to login
    if(!loggedInEmail){ 
        window.location.href = "index.html"; 
        return; 
    }
    
    try {
        // Fetch specific hotel details securely from Database based on the logged-in email
        const q = query(collection(db, "hotels"), where("email", "==", loggedInEmail));
        const snap = await getDocs(q);
        
        if(!snap.empty) {
            const h = snap.docs[0].data();
            
            // Block access if the Super Admin has suspended the account
            if(h.status === "Inactive") {
                alert("Account Suspended by Super Admin. Please contact support.");
                localStorage.removeItem("hotelUserEmail");
                window.location.href = "index.html";
                return;
            }

            // Hide the loading screen and display welcome messages
            document.getElementById("authLoader").style.display = "none";
            document.getElementById("welcomeText").innerText = "Welcome, " + (h.ownerName || "Director");
            document.getElementById("hotelName").innerText = h.hotelName || "Entity";
            
            // 1. Populate the Profile Tab Data
            ["pHotel", "pOwner", "pEmail", "pMobile", "pCity", "pAddress", "pPlan"].forEach(id => {
                let key = id.substring(1).toLowerCase();
                
                // Map the HTML IDs to the Database fields
                if(key === 'hotel') key = 'hotelName';
                if(key === 'owner') key = 'ownerName';
                
                const element = document.getElementById(id);
                if(element) {
                    element.innerText = h[key] || "N/A";
                }
            });

            // 2. Populate the Billing & Payments Data
            // This safely sends only this hotel's payment array to the UI script in hotel-dashboard.html
            if(typeof window.renderClientPayments === "function") {
                window.renderClientPayments(h.payments || []);
            }

        } else {
            // If the email is not found in the database, clear storage and force logout
            localStorage.removeItem("hotelUserEmail");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred while connecting to the server. Please check your internet connection and try again.");
    }
}

// Initialize the dashboard validation
checkAccess();

// Secure Logout Button Event Listener
document.getElementById("userLogoutBtn").addEventListener("click", () => {
    localStorage.removeItem("hotelUserEmail");
    window.location.href = "index.html";
});
