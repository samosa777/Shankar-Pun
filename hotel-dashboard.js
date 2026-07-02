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

async function checkAccess() {
    if (!loggedInEmail || loggedInEmail === "superadmin@power.com") {
        window.location.href = "index.html";
        return;
    }

    try {
        const q = query(collection(db, "hotels"), where("email", "==", loggedInEmail));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const hotelDoc = querySnapshot.docs[0];
            const h = hotelDoc.data();
            
            document.getElementById("authLoader").style.display = "none";
            document.getElementById("welcomeText").innerText = "Welcome, " + (h.ownerName || "Executive Officer");
            document.getElementById("hotelName").innerText = h.hotelName || "Corporate Infrastructure Unit Node";
            
            document.getElementById("pHotel").innerText = h.hotelName || "N/A";
            document.getElementById("pOwner").innerText = h.ownerName || "N/A";
            document.getElementById("pEmail").innerText = h.email || "N/A";
            document.getElementById("pMobile").innerText = h.mobile || "N/A";
            document.getElementById("pCity").innerText = h.city || "N/A";
            document.getElementById("pAddress").innerText = h.address || "N/A";
            document.getElementById("pPlan").innerText = h.plan || "N/A";

            document.getElementById("launchMenuBtn").onclick = () => {
                window.location.href = `Menu.html?id=${hotelDoc.id}&role=hotelowner`;
            };

            const container = document.getElementById("clientPaymentListContainer");
            const paymentsArray = h.payments || [];
            if(paymentsArray.length === 0) {
                container.innerHTML = `<p style="color:#888; text-align:center; padding: 40px;">No clear transacted settlement historical records trace verified on system nodes.</p>`;
            } else {
                paymentsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
                let html = "";
                paymentsArray.forEach(pay => {
                    html += `
                        <div class="history-item">
                            <div>
                                <div class="history-date">Settled on: ${pay.date || 'N/A'}</div>
                                <div class="history-remarks">${pay.remarks || 'Standard Automated System Clearance Receipt'}</div>
                            </div>
                            <div class="history-amount">₹ ${Number(pay.amount).toLocaleString('en-IN')}</div>
                        </div>`;
                });
                container.innerHTML = html;
            }
        } else {
            localStorage.clear();
            window.location.href = "index.html";
        }
    } catch (error) {
        alert("Ecosystem Link Interrupted. Verify hardware network parameters: " + error.message);
    }
}

checkAccess();

document.getElementById("userLogoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
});