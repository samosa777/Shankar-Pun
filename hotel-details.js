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

let logoutTimer;
function resetTimer() { 
    clearTimeout(logoutTimer); 
    logoutTimer = setTimeout(() => { signOut(auth).then(() => window.location.href = "index.html"); }, 300000); 
}
window.onload = resetTimer; window.onmousemove = resetTimer; window.onkeypress = resetTimer;

const params = new URLSearchParams(window.location.search);
const hotelId = params.get("id");

onAuthStateChanged(auth, async (user) => {
    if (!user || user.email !== "superadmin@power.com") { window.location.href = "index.html"; return; }
    document.getElementById("authLoader").style.display = "none";
    if (!hotelId) { alert("Invalid Entity"); window.location.href = "dashboard.html"; return; }
    
    // Set today's date automatically in the billing form
    document.getElementById('pay_date').valueAsDate = new Date();
    
    loadHotel();
});

// Profile fields
const fields = ["hotelName", "ownerName", "email", "password", "status", "mobile", "whatsapp", "address", "city", "state", "country", "maps", "website", "facebook", "instagram", "plan"];

async function loadHotel() {
    try {
        const hotelSnap = await getDoc(doc(db, "hotels", hotelId));
        if (!hotelSnap.exists()) return alert("Not Found");
        const data = hotelSnap.data();
        
        document.getElementById("displayHotelName").innerText = data.hotelName || "Unnamed";
        document.getElementById("displayDocId").innerText = "ID: " + hotelId;

        fields.forEach(f => {
            if(document.getElementById(`v_${f}`)) {
                document.getElementById(`v_${f}`).value = data[f] || "";
            }
        });

        if(!data.status) document.getElementById("v_status").value = "Active";

        // Load Payments
        renderPayments(data.payments || []);

    } catch (error) { console.error(error); }
}

// Toggle Edit
document.getElementById("toggleEditBtn").addEventListener("click", () => {
    document.getElementById("toggleEditBtn").style.display = "none";
    document.getElementById("saveBtn").style.display = "inline-block";
    
    fields.forEach(f => {
        if(document.getElementById(`v_${f}`)) {
            document.getElementById(`v_${f}`).disabled = false;
            document.getElementById(`v_${f}`).style.border = "1px solid #D4AF37";
        }
    });
});

// Save Profile Edits
document.getElementById("saveBtn").addEventListener("click", async () => {
    try {
        const passVal = document.getElementById("v_password").value.trim();
        if(!passVal) {
            alert("Password cannot be empty. Please enter a password for the client.");
            return;
        }

        document.getElementById("saveBtn").innerText = "Saving...";
        const updatedData = {};
        fields.forEach(f => {
            if(document.getElementById(`v_${f}`)) updatedData[f] = document.getElementById(`v_${f}`).value;
        });
        
        await updateDoc(doc(db, "hotels", hotelId), updatedData);
        alert("Profile Updated Successfully!");
        window.location.reload();
    } catch (e) { 
        alert(e.message); 
        document.getElementById("saveBtn").innerText = "Save Changes"; 
    }
});


// Add Payment Record Logic
document.getElementById("addPaymentBtn").addEventListener("click", async () => {
    const date = document.getElementById("pay_date").value;
    const amount = document.getElementById("pay_amount").value;
    const remarks = document.getElementById("pay_remarks").value;

    if(!date || !amount) {
        alert("Please provide both Date and Amount.");
        return;
    }

    const btn = document.getElementById("addPaymentBtn");
    btn.innerText = "Adding...";
    btn.disabled = true;

    try {
        const newPayment = {
            id: Date.now().toString(),
            date: date,
            amount: amount,
            remarks: remarks || "No remarks"
        };

        // Push new payment object into the 'payments' array in Firestore
        await updateDoc(doc(db, "hotels", hotelId), {
            payments: arrayUnion(newPayment)
        });

        alert("Payment Recorded Successfully!");
        document.getElementById("pay_amount").value = "";
        document.getElementById("pay_remarks").value = "";
        
        // Reload UI to show the new record
        loadHotel();

    } catch (e) {
        alert("Error adding payment: " + e.message);
    } finally {
        btn.innerText = "Record Payment";
        btn.disabled = false;
    }
});

// Render Payments on UI
function renderPayments(paymentsArray) {
    const container = document.getElementById("paymentListContainer");
    const totalDisplay = document.getElementById("totalAmountDisplay");
    
    if(paymentsArray.length === 0) {
        container.innerHTML = `<p style="color:#888; text-align:center; padding: 20px;">No payment records found.</p>`;
        if(totalDisplay) totalDisplay.innerText = "0";
        return;
    }

    let totalAmount = 0;

    // Sort by date descending (newest first)
    paymentsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

    let html = "";
    paymentsArray.forEach(pay => {
        totalAmount += Number(pay.amount) || 0; // Calculating the total amount
        
        html += `
            <div class="history-item">
                <div>
                    <div class="history-date">${formatDate(pay.date)}</div>
                    <div class="history-remarks">${pay.remarks}</div>
                </div>
                <div class="history-amount">₹ ${pay.amount}</div>
            </div>
        `;
    });

    container.innerHTML = html;
    if(totalDisplay) totalDisplay.innerText = totalAmount.toLocaleString('en-IN'); // Adding comma separation (e.g., 5,000)
}

// Format date helper (YYYY-MM-DD to DD-MM-YYYY)
function formatDate(dateStr) {
    if(!dateStr) return "";
    const parts = dateStr.split('-');
    if(parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
}
