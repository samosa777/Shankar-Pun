import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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

document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const btn = document.getElementById("loginBtn");
    
    if(!email || !password) return alert("Credentials required");
    
    btn.innerText = "VERIFYING...";
    try {
        await signInWithEmailAndPassword(auth, email, password);
        
        if(email === "superadmin@power.com"){
            window.location.replace("dashboard.html");
        } else {
            // Check if the Hotel Owner is Active or Inactive
            const q = query(collection(db, "hotels"), where("email", "==", email));
            const snapshot = await getDocs(q);
            let isActive = false;
            
            snapshot.forEach((doc) => {
                const data = doc.data();
                if(data.status && data.status.toLowerCase() === "active") {
                    isActive = true;
                }
            });

            if(!isActive) {
                // If inactive, force logout immediately
                await signOut(auth);
                btn.innerText = "AUTHENTICATE";
                alert("ACCESS DENIED: Your account is marked as INACTIVE. Please contact the administrator.");
                return;
            }
            
            window.location.replace("hotel-dashboard.html");
        }
    } catch(error){
        btn.innerText = "AUTHENTICATE";
        alert("Access Denied: " + error.message);
    }
});