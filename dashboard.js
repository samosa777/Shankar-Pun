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

// 3 Minute Auto-Logout 
let logoutTimer;
function resetTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
        signOut(auth).then(() => window.location.href = "index.html");
    }, 180000); // 3 mins in ms
}
window.onload = resetTimer;
window.onmousemove = resetTimer;
window.onkeypress = resetTimer;
window.ontouchstart = resetTimer;

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
            
            const statusClass = (h.status === "Active") ? "badge-active" : "badge-inactive";
            if(h.status === "Active") active++;

            let hotelTotalPaid = 0;
            if(h.payments && Array.isArray(h.payments)) {
                h.payments.forEach(pay => {
                    hotelTotalPaid += Number(pay.amount) || 0;
                });
            }
            grandTotalRevenue += hotelTotalPaid;

            clientsHtml += `
            <tr>
                <td><a href="hotel-details.html?id=${doc.id}" class="hotel-link">${h.hotelName || "Unnamed Architecture"}</a></td>
                <td>${h.ownerName || "N/A"}</td>
                <td><span class="${statusClass}">${h.status || "Inactive"}</span></td>
            </tr>`;

            revenueHtml += `
            <tr>
                <td><a href="hotel-details.html?id=${doc.id}" class="hotel-link">${h.hotelName || "Unnamed Architecture"}</a></td>
                <td>${h.ownerName || "N/A"}</td>
                <td class="revenue-text">₹ ${hotelTotalPaid.toLocaleString('en-IN')}</td>
            </tr>`;
        });

        document.getElementById("totalHotels").innerText = total;
        document.getElementById("activeHotels").innerText = active;
        document.getElementById("totalRevenueDisplay").innerText = grandTotalRevenue.toLocaleString('en-IN');

        document.getElementById("hotelList").innerHTML = total === 0 ? `<tr><td colspan="3" style="text-align:center; color:#666;">No dynamic records allocated.</td></tr>` : clientsHtml;
        document.getElementById("revenueList").innerHTML = total === 0 ? `<tr><td colspan="3" style="text-align:center; color:#666;">No records allocated.</td></tr>` : revenueHtml;

    } catch (error) {
        alert("System Data Retrieval Infrastructure Fault: " + error.message);
    }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth).then(() => window.location.href = "index.html");
});