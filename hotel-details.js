import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
    loadHotel();
});

// All fields including password and status
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

        // Default to Active if old account doesn't have status
        if(!data.status) document.getElementById("v_status").value = "Active";

        const menuUrl = window.location.origin + "/menu.html?id=" + hotelId;
        document.getElementById("menuLink").innerText = menuUrl;
        document.getElementById("menuLink").href = menuUrl;
        document.getElementById("qrImage").src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(menuUrl);
    } catch (error) { console.error(error); }
}

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
        alert("Credentials, Status, and Records Updated Successfully!");
        window.location.reload();
    } catch (e) { 
        alert(e.message); 
        document.getElementById("saveBtn").innerText = "Save Changes"; 
    }
});