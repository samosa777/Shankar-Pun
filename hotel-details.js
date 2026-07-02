import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

const urlParams = new URLSearchParams(window.location.search);
const hotelId = urlParams.get('id');

onAuthStateChanged(auth, (user) => {
    if (!user || localStorage.getItem("hotelUserEmail") !== "superadmin@power.com") {
        window.location.href = "index.html";
    } else {
        document.getElementById("authLoader").style.display = "none";
    }
});

if (!hotelId) {
    alert("Null reference structural pointer error. Returning to global ledger command.");
    window.location.href = "dashboard.html";
}

async function fetchHotelMetadata() {
    try {
        const docRef = doc(db, "hotels", hotelId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("hotelHeaderTitle").innerText = data.hotelName || "Corporate Architecture Unit Node";
            document.getElementById("dHotel").innerText = data.hotelName || "N/A";
            document.getElementById("dOwner").innerText = data.ownerName || "N/A";
            document.getElementById("dEmail").innerText = data.email || "N/A";
            document.getElementById("dStatus").innerText = data.status || "N/A";
            document.getElementById("dMobile").innerText = data.mobile || "N/A";
            document.getElementById("dCity").innerText = data.city || "N/A";
            document.getElementById("dAddress").innerText = data.address || "N/A";
            document.getElementById("dPlan").innerText = data.plan || "N/A";

            document.getElementById("launchCmsBtn").onclick = () => {
                window.location.href = `Menu.html?id=${hotelId}&role=admin`;
            };

            renderPayments(data.payments || []);
        } else {
            alert("No structural record verified under current hash mapping.");
            window.location.href = "dashboard.html";
        }
    } catch (e) {
        alert("Ecosystem Interconnectivity Core Error: " + e.message);
    }
}

function renderPayments(paymentsArray) {
    const container = document.getElementById("paymentListContainer");
    const totalDisplay = document.getElementById("totalAmountDisplay");
    
    if(paymentsArray.length === 0) {
        container.innerHTML = `<p style="color:#666; text-align:center; padding: 20px; font-size:14px;">No clear financial transacted values registered to this file node.</p>`;
        if(totalDisplay) totalDisplay.innerText = "0";
        return;
    }

    let totalAmount = 0;
    paymentsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

    let html = "";
    paymentsArray.forEach(pay => {
        totalAmount += Number(pay.amount) || 0;
        html += `
            <div class="history-item">
                <div>
                    <div class="history-date">${pay.date || 'N/A'}</div>
                    <div class="history-remarks">${pay.remarks || 'Standard Automated System Clearance Receipt'}</div>
                </div>
                <div class="history-amount">₹ ${Number(pay.amount).toLocaleString('en-IN')}</div>
            </div>`;
    });

    container.innerHTML = html;
    if(totalDisplay) totalDisplay.innerText = totalAmount.toLocaleString('en-IN');
}

document.getElementById("addPaymentBtn").addEventListener("click", async () => {
    const amt = document.getElementById("payAmount").value;
    const dt = document.getElementById("payDate").value.trim();
    const rem = document.getElementById("payRemarks").value.trim();
    const btn = document.getElementById("addPaymentBtn");

    if(!amt || !dt || !rem) {
        alert("All ledger entry attributes required to commit log flow.");
        return;
    }

    btn.innerText = "Processing Transaction Lock...";
    btn.disabled = true;

    try {
        const docRef = doc(db, "hotels", hotelId);
        const newPayment = { amount: Number(amt), date: dt, remarks: rem };
        
        await updateDoc(docRef, { payments: arrayUnion(newPayment) });
        
        document.getElementById("payAmount").value = "";
        document.getElementById("payDate").value = "";
        document.getElementById("payRemarks").value = "";
        
        await fetchHotelMetadata();
        alert("Transaction lock committed successfully to architecture arrays.");
    } catch(err) {
        alert("Ecosystem Mutation Processing Interruption Error: " + err.message);
    } finally {
        btn.innerText = "Commit Remittance Log";
        btn.disabled = false;
    }
});

fetchHotelMetadata();