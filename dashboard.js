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

// 5-Minute Inactivity Auto-Logout
let logoutTimer;
function resetTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
        signOut(auth).then(() => window.location.href = "index.html");
    }, 5 * 60 * 1000); // 5 Minutes
}
window.onload = resetTimer;
window.onmousemove = resetTimer;
window.onkeypress = resetTimer;
window.ontouchstart = resetTimer;

// Route Protection & Data Fetching
onAuthStateChanged(auth, async (user) => {
    if (!user || user.email !== "superadmin@power.com") {
        window.location.href = "index.html";
        return;
    }
    document.getElementById("authLoader").style.display = "none";

    try {
        const snapshot = await getDocs(collection(db, "hotels"));
        
        let total = 0;
        let active = 0;
        let grandTotalRevenue = 0;
        
        let clientsHtml = "";
        let revenueHtml = "";
        
        snapshot.forEach((doc) => {
            const h = doc.data();
            total++;
            
            // Check Status
            const statusClass = (h.status === "Active") ? "badge-active" : "badge-inactive";
            if(h.status === "Active") active++;

            // Calculate Revenue for this specific hotel
            let hotelTotalPaid = 0;
            if(h.payments && Array.isArray(h.payments)) {
                h.payments.forEach(pay => {
                    hotelTotalPaid += Number(pay.amount) || 0;
                });
            }
            grandTotalRevenue += hotelTotalPaid;

            // Build Client Portfolios Table Row
            clientsHtml += `
            <tr>
                <td><a href="hotel-details.html?id=${doc.id}" class="hotel-link">${h.hotelName || "Unnamed Entity"}</a></td>
                <td>${h.ownerName || "N/A"}</td>
                <td><span class="${statusClass}">${h.status || "Inactive"}</span></td>
            </tr>`;

            // Build Revenue Details Table Row
            revenueHtml += `
            <tr>
                <td><a href="hotel-details.html?id=${doc.id}" class="hotel-link">${h.hotelName || "Unnamed Entity"}</a></td>
                <td>${h.ownerName || "N/A"}</td>
                <td class="revenue-text">₹ ${hotelTotalPaid.toLocaleString('en-IN')}</td>
            </tr>`;
        });

        // Update Overview Stats
        document.getElementById("totalHotels").innerText = total;
        document.getElementById("activeHotels").innerText = active;
        document.getElementById("totalRevenueDisplay").innerText = grandTotalRevenue.toLocaleString('en-IN'); // Format with commas like 5,000

        // Populate Tables
        document.getElementById("hotelList").innerHTML = total === 0 ? `<tr><td colspan="3" style="text-align:center;">No records found.</td></tr>` : clientsHtml;
        document.getElementById("revenueList").innerHTML = total === 0 ? `<tr><td colspan="3" style="text-align:center;">No records found.</td></tr>` : revenueHtml;

    } catch (error) {
        alert("Data Retrieval Failed: " + error.message);
    }
});

// Logout Logic
document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth).then(() => window.location.href = "index.html");
});