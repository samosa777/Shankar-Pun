import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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

document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    
    if(!email || !pass) {
        alert("Please enter both email and password.");
        return;
    }

    const loader = document.getElementById('authLoader');
    loader.style.display = 'flex';

    if(email === "superadmin@power.com") {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            window.location.href = "dashboard.html";
        } catch(error) {
            loader.style.display = 'none';
            alert("Super Admin Auth Failed: " + error.message);
        }
    } else {
        try {
            const q = query(collection(db, "hotels"), where("email", "==", email), where("password", "==", pass));
            const snap = await getDocs(q);
            if(!snap.empty) {
                const hotelData = snap.docs[0].data();
                if(hotelData.status === "Inactive") {
                    loader.style.display = 'none';
                    alert("Account is Inactive. Please contact Super Admin.");
                    return;
                }
                localStorage.setItem("hotelUserEmail", email);
                localStorage.setItem("hotelUserId", snap.docs[0].id);
                window.location.href = "hotel-dashboard.html";
            } else {
                loader.style.display = 'none';
                alert("Invalid Client Credentials.");
            }
        } catch(error) {
            loader.style.display = 'none';
            alert("Database Error: " + error.message);
        }
    }
});