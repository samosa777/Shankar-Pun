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

// Route Protection: Redirect if already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        if(user.email === "superadmin@power.com") { window.location.href = "dashboard.html"; }
        else { window.location.href = "hotel-dashboard.html"; }
    }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const btn = document.getElementById("loginBtn");
    const loader = document.getElementById("authLoader");
    
    if(!email || !password) return alert("Credentials required");
    
    btn.innerText = "VERIFYING...";
    loader.style.display = "flex";

    try {
        // Step 1: Check Inactive Status before logging in for Hotel Users
        if (email !== "superadmin@power.com") {
            const q = query(collection(db, "hotels"), where("email", "==", email));
            const snap = await getDocs(q);
            if (!snap.empty) {
                const hotelData = snap.docs[0].data();
                if (hotelData.status === "Inactive") {
                    throw new Error("Your account has been deactivated by the Super Admin.");
                }
            } else {
                 throw new Error("Account not found in database.");
            }
        }

        // Step 2: Authenticate
        await signInWithEmailAndPassword(auth, email, password);
        // Routing handled by onAuthStateChanged above
    } catch(error){
        loader.style.display = "none";
        btn.innerText = "AUTHENTICATE";
        alert("Access Denied: " + error.message);
    }
});