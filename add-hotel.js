import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = { apiKey: "AIzaSyBkRWPYZtmjS-lpiojtNtY_6h4IORZ6xjc", authDomain: "hotel-menu-f25ed.firebaseapp.com", projectId: "hotel-menu-f25ed", storageBucket: "hotel-menu-f25ed.firebasestorage.app", messagingSenderId: "750886705933", appId: "1:750886705933:web:c3331f1dd8cfc99342ee44" };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
const secondaryAuth = getAuth(secondaryApp);

let logoutTimer;
function resetTimer() { clearTimeout(logoutTimer); logoutTimer = setTimeout(() => { signOut(auth).then(() => window.location.href = "index.html"); }, 300000); }
window.onload = resetTimer; window.onmousemove = resetTimer; window.onkeypress = resetTimer;

onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== "superadmin@power.com") { window.location.href = "index.html"; }
    else { document.getElementById("authLoader").style.display = "none"; }
});

document.getElementById("createHotelBtn").addEventListener("click", async () => {
    const fields = ["hotelName", "ownerName", "mobile", "whatsapp", "email", "password", "address", "city", "state", "country", "maps", "website", "facebook", "instagram", "plan", "startDate", "status"];
    const data = {};
    fields.forEach(f => data[f] = document.getElementById(f).value);

    if (!data.hotelName || !data.email || !data.password) return alert("Vital structural data configuration units are missing.");
    document.getElementById("createHotelBtn").innerText = "INITIALIZING CORE DEPLOYMENT...";

    try {
        const userCred = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);
        data.hotelUID = userCred.user.uid;
        data.createdAt = serverTimestamp();
        data.payments = [];

        await addDoc(collection(db, "hotels"), data);
        await signOut(secondaryAuth);
        
        alert("Client Corporate System Identity Initialized Successfully within Ecosystem Architecture.");
        window.location.href = "dashboard.html";
    } catch (e) { 
        alert("Framework Exception Fault: " + e.message); 
        document.getElementById("createHotelBtn").innerText = "INITIALIZE CLIENT ALLOCATION"; 
    }
});