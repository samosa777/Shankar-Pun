import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const loggedInEmail = localStorage.getItem("hotelUserEmail");

// 3 Minute Auto-Logout 
let logoutTimer;
function resetTimer() { 
    clearTimeout(logoutTimer); 
    logoutTimer = setTimeout(() => { 
        localStorage.removeItem("hotelUserEmail"); 
        localStorage.removeItem("hotelUserId");
        window.location.href = "index.html"; 
    }, 180000); 
}

window.onload = resetTimer; 
window.onmousemove = resetTimer; 
window.onkeypress = resetTimer;
window.ontouchstart = resetTimer;

async function checkAccess() {
    if(!loggedInEmail){ 
        window.location.href = "index.html"; 
        return; 
    }
    
    try {
        const q = query(collection(db, "hotels"), where("email", "==", loggedInEmail));
        const snap = await getDocs(q);
        
        if(!snap.empty) {
            const h = snap.docs[0].data();
            
            if(h.status === "Inactive") {
                alert("Corporate Session Suspended by Super Admin Command. Contact operations support framework.");
                localStorage.removeItem("hotelUserEmail");
                localStorage.removeItem("hotelUserId");
                window.location.href = "index.html";
                return;
            }

            document.getElementById("authLoader").style.display = "none";
            document.getElementById("welcomeText").innerText = "Welcome, " + (h.ownerName || "Executive Officer");
            document.getElementById("hotelName").innerText = h.hotelName || "Corporate Infrastructure Unit Node";
            
            ["pHotel", "pOwner", "pEmail", "pMobile", "pCity", "pAddress", "pPlan"].forEach(id => {
                let key = id.substring(1).toLowerCase();
                
                if(key === 'hotel') key = 'hotelName';
                if(key === 'owner') key = 'ownerName';
                
                const element = document.getElementById(id);
                if(element) {
                    element.innerText = h[key] || "Registry Matrix Unassigned";
                }
            });

            if(typeof window.renderClientPayments === "function") {
                window.renderClientPayments(h.payments || []);
            }

        } else {
            localStorage.removeItem("hotelUserEmail");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Critical Cloud Interfacing Fault: ", error);
        alert("Ecosystem Link Interrupted. Verify hardware network parameters connectivity files.");
    }
}

checkAccess();

document.getElementById("userLogoutBtn").addEventListener("click", () => {
    localStorage.removeItem("hotelUserEmail");
    localStorage.removeItem("hotelUserId");
    window.location.href = "index.html";
});