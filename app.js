import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
    if (user && user.email === "superadmin@power.com") { 
        localStorage.setItem("hotelUserEmail", user.email);
        window.location.href = "dashboard.html"; 
    }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const btn = document.getElementById("loginBtn");
    const loader = document.getElementById("authLoader");
    
    if(!email || !password) return alert("All authorization credentials are required.");
    
    btn.innerText = "AUTHENTICATING...";
    loader.style.display = "flex";

    try {
        if (email === "superadmin@power.com") {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            const q = query(collection(db, "hotels"), where("email", "==", email));
            const snap = await getDocs(q);
            
            if (!snap.empty) {
                const hotelDoc = snap.docs[0];
                const hotelData = hotelDoc.data();
                
                if (hotelData.password !== password) {
                    throw new Error("Invalid username or system password allocation.");
                }
                
                if (hotelData.status === "Inactive") {
                    throw new Error("Your corporate account configuration has been deactivated by Super Admin.");
                }
                
                localStorage.setItem("hotelUserEmail", email);
                localStorage.setItem("hotelDocId", hotelDoc.id);
                window.location.href = "hotel-dashboard.html";
            } else {
                 throw new Error("Account records not found in systems architecture.");
            }
        }
    } catch(error){
        loader.style.display = "none";
        btn.innerText = "AUTHENTICATE SYSTEM";
        alert("Access Denied Security Core: " + error.message);
    }
});