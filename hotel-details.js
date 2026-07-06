import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

// 3 Minute Auto-Logout 
let logoutTimer;
function resetTimer() { 
    clearTimeout(logoutTimer); 
    logoutTimer = setTimeout(() => { signOut(auth).then(() => window.location.href = "index.html"); }, 180000); 
}
window.onload = resetTimer; window.onmousemove = resetTimer; window.onkeypress = resetTimer; window.ontouchstart = resetTimer;

const params = new URLSearchParams(window.location.search);
const hotelId = params.get("id");

if(hotelId) {
    document.getElementById("superAdminMenuLink").href = `Menu.html?id=${hotelId}`;
}

onAuthStateChanged(auth, async (user) => {
    if (!user || user.email !== "superadmin@power.com") { window.location.href = "index.html"; return; }
    document.getElementById("authLoader").style.display = "none";
    if (!hotelId) { alert("Invalid Client Request Parameter."); window.location.href = "dashboard.html"; return; }
    
    document.getElementById('pay_date').valueAsDate = new Date();
    loadHotel();
});

const fields = ["hotelName", "ownerName", "email", "password", "status", "mobile", "whatsapp", "address", "city", "state", "country", "maps", "website", "facebook", "instagram", "plan"];

async function loadHotel() {
    try {
        const hotelSnap = await getDoc(doc(db, "hotels", hotelId));
        if (!hotelSnap.exists()) return alert("Requested Database Entity Node Not Present.");
        const data = hotelSnap.data();
        
        document.getElementById("displayHotelName").innerText = data.hotelName || "Unnamed Asset";
        document.getElementById("displayDocId").innerText = "Ecosystem Location Index Node Reference ID: " + hotelId;

        fields.forEach(f => {
            if(document.getElementById(`v_${f}`)) {
                document.getElementById(`v_${f}`).value = data[f] || "";
            }
        });

        if(!data.status) document.getElementById("v_status").value = "Active";

        renderPayments(data.payments || []);

    } catch (error) { console.error(error); }
}

document.getElementById("toggleEditBtn").addEventListener("click", () => {
    document.getElementById("toggleEditBtn").style.display = "none";
    document.getElementById("saveBtn").style.display = "inline-block";
    
    fields.forEach(f => {
        if(document.getElementById(`v_${f}`)) {
            document.getElementById(`v_${f}`).disabled = false;
            document.getElementById(`v_${f}`).style.border = "1px solid #D4AF37";
            document.getElementById(`v_${f}`).style.background = "#050505";
        }
    });
});

document.getElementById("saveBtn").addEventListener("click", async () => {
    try {
        const passVal = document.getElementById("v_password").value.trim();
        if(!passVal) {
            alert("Cryptographic access pass phrases cannot resolve into empty vectors.");
            return;
        }

        document.getElementById("saveBtn").innerText = "COMMITTING PARAMS...";
        const updatedData = {};
        fields.forEach(f => {
            if(document.getElementById(`v_${f}`)) updatedData[f] = document.getElementById(`v_${f}`).value;
        });
        
        await updateDoc(doc(db, "hotels", hotelId), updatedData);
        alert("Systems Parameters Core Registry Updated Safely.");
        window.location.reload();
    } catch (e) { 
        alert("Ecosystem File Sync Exception: " + e.message); 
        document.getElementById("saveBtn").innerText = "Commit Parameter Modifications"; 
    }
});

document.getElementById("addPaymentBtn").addEventListener("click", async () => {
    const date = document.getElementById("pay_date").value;
    const amount = document.getElementById("pay_amount").value;
    const remarks = document.getElementById("pay_remarks").value;

    if(!date || !amount) {
        alert("Valuation data parameters (Date and Capital Inflow metrics) must be complete.");
        return;
    }

    const btn = document.getElementById("addPaymentBtn");
    btn.innerText = "RECORDING CAPITAL NODE...";
    btn.disabled = true;

    try {
        const newPayment = {
            id: Date.now().toString(),
            date: date,
            amount: amount,
            remarks: remarks || "System Admin Standard Remittance"
        };

        await updateDoc(doc(db, "hotels", hotelId), {
            payments: arrayUnion(newPayment)
        });

        alert("Remittance Log Synchronized Successfully.");
        document.getElementById("pay_amount").value = "";
        document.getElementById("pay_remarks").value = "";
        loadHotel();

    } catch (e) {
        alert("Capital Allocation Write Failure Exception: " + e.message);
    } finally {
        btn.innerText = "Commit Remittance Log";
        btn.disabled = false;
    }
});

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
                    <div class="history-date">${formatDate(pay.date)}</div>
                    <div class="history-remarks">${pay.remarks}</div>
                </div>
                <div class="history-amount">₹ ${Number(pay.amount).toLocaleString('en-IN')}</div>
            </div>
        `;
    });

    container.innerHTML = html;
    if(totalDisplay) totalDisplay.innerText = totalAmount.toLocaleString('en-IN');
}

function formatDate(dateStr) {
    if(!dateStr) return "";
    const parts = dateStr.split('-');
    if(parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
}