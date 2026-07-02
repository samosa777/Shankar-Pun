import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Primary App Configuration
const firebaseConfig = { 
    apiKey: "AIzaSyBkRWPYZtmjS-lpiojtNtY_6h4IORZ6xjc", 
    authDomain: "hotel-menu-f25ed.firebaseapp.com", 
    projectId: "hotel-menu-f25ed", 
    storageBucket: "hotel-menu-f25ed.firebasestorage.app", 
    messagingSenderId: "750886705933", 
    appId: "1:750886705933:web:c3331f1dd8cfc99342ee44" 
};

// Initialize Primary and Secondary Apps
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
const secondaryAuth = getAuth(secondaryApp);

// Security: Inactivity Logout Timer
let logoutTimer;
function resetTimer() { 
    clearTimeout(logoutTimer); 
    logoutTimer = setTimeout(() => { 
        signOut(auth).then(() => window.location.href = "index.html"); 
    }, 300000); 
}
window.onload = resetTimer; 
window.onmousemove = resetTimer; 
window.onkeypress = resetTimer;

// Security: Verify Superadmin Privileges
onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== "superadmin@power.com") { 
        window.location.href = "index.html"; 
    } else { 
        document.getElementById("authLoader").style.display = "none"; 
    }
});

// Form Submission Handler
document.getElementById("addHotelForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevents default page reload, letting HTML5 validation run first

    const submitBtn = document.getElementById("createHotelBtn");
    const fields = ["hotelName", "ownerName", "mobile", "whatsapp", "email", "password", "address", "city", "state", "country", "maps", "website", "facebook", "instagram", "plan", "startDate", "status"];
    const data = {};
    
    // Extract values dynamically
    fields.forEach(f => data[f] = document.getElementById(f).value.trim());

    // Update UI state during processing
    submitBtn.innerText = "INITIALIZING CORE DEPLOYMENT...";
    submitBtn.disabled = true;

    try {
        // Create user in secondary auth to prevent admin session override
        const userCred = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);
        
        // Structure the document payload
        data.hotelUID = userCred.user.uid;
        data.createdAt = serverTimestamp();
        data.payments = [];

        // Save to Firestore
        await addDoc(collection(db, "hotels"), data);
        
        // Sign out the secondary instance to clean up
        await signOut(secondaryAuth);
        
        alert("Client Corporate System Identity Initialized Successfully within Ecosystem Architecture.");
        window.location.href = "dashboard.html";
        
    } catch (error) { 
        console.error("Deployment Error:", error);
        alert("Framework Exception Fault: " + error.message); 
        
        // Reset UI state on failure
        submitBtn.innerText = "INITIALIZE CLIENT ALLOCATION"; 
        submitBtn.disabled = false;
    }
});