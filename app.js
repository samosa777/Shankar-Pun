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

    try {
        await signInWithEmailAndPassword(auth, email, password);
        
        // Force redirect to prevent browser from caching the login state
        if (email === "superadmin@power.com") {
            window.location.replace("dashboard.html");
        } else {
            window.location.replace("hotel-dashboard.html");
        }
    } catch (error) {
        alert("Authentication Failed: " + error.message);
    }
});