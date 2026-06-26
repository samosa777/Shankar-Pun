import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const btn = document.getElementById("loginBtn");
    
    if(!email || !password) return alert("Credentials required");
    
    btn.innerText = "VERIFYING...";
    try {
        await signInWithEmailAndPassword(auth, email, password);
        if(email === "superadmin@power.com"){
            window.location.href = "dashboard.html";
        } else {
            window.location.href = "hotel-dashboard.html";
        }
    } catch(error){
        btn.innerText = "AUTHENTICATE";
        alert("Access Denied: " + error.message);
    }
});