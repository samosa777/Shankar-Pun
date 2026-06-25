import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = { apiKey: "AIzaSyBkRWPYZtmjS-lpiojtNtY_6h4IORZ6xjc", authDomain: "hotel-menu-f25ed.firebaseapp.com", projectId: "hotel-menu-f25ed", storageBucket: "hotel-menu-f25ed.firebasestorage.app", messagingSenderId: "750886705933", appId: "1:750886705933:web:c3331f1dd8cfc99342ee44" };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== "superadmin@power.com") { window.location.href = "index.html"; }
    else { document.getElementById("authLoader").style.display = "none"; }
});

document.getElementById("createHotelBtn").addEventListener("click", async () => {
    const fields = ["hotelName", "ownerName", "mobile", "whatsapp", "email", "password", "address", "city", "state", "country", "maps", "website", "facebook", "instagram", "plan", "startDate", "status"];
    const data = {};
    fields.forEach(f => data[f] = document.getElementById(f).value);

    if (!data.hotelName || !data.email || !data.password) return alert("Essential fields missing.");
    document.getElementById("createHotelBtn").innerText = "DEPLOYING...";

    try {
        const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
        data.hotelUID = userCred.user.uid;
        delete data.password; // Do not save password in plain text database
        data.createdAt = serverTimestamp();

        await addDoc(collection(db, "hotels"), data);
        alert("Client Entity Initialized.");
        window.location.reload();
    } catch (e) { alert(e.message); document.getElementById("createHotelBtn").innerText = "INITIALIZE DEPLOYMENT"; }
});