import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = { apiKey: "AIzaSyBkRWPYZtmjS-lpiojtNtY_6h4IORZ6xjc", authDomain: "hotel-menu-f25ed.firebaseapp.com", projectId: "hotel-menu-f25ed", storageBucket: "hotel-menu-f25ed.firebasestorage.app", messagingSenderId: "750886705933", appId: "1:750886705933:web:c3331f1dd8cfc99342ee44" };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, async(user)=>{
    if(!user){ window.location.replace("index.html"); return; }
    
    let isUserValid = false;
    const snapshot = await getDocs(collection(db,"hotels"));
    
    snapshot.forEach((doc)=>{
        const h = doc.data();
        if(h.email && h.email.toLowerCase() === user.email.toLowerCase()){
            // Block access if suspended mid-session
            if(h.status && h.status.toLowerCase() !== "active"){
                alert("Session Expired: Your account has been suspended.");
                signOut(auth).then(() => window.location.replace("index.html"));
                return;
            }
            
            isUserValid = true;
            document.getElementById("welcomeText").innerText = "Welcome, " + (h.ownerName || "Director");
            document.getElementById("hotelName").innerText = h.hotelName || "Entity";
            ["pHotel", "pOwner", "pEmail", "pMobile", "pCity", "pAddress", "pPlan", "pStatus"].forEach(id => {
                let key = id.substring(1).toLowerCase();
                if(key === 'hotel') key = 'hotelName';
                if(key === 'owner') key = 'ownerName';
                if(document.getElementById(id)) document.getElementById(id).innerText = h[key] || "N/A";
            });
        }
    });

    if(isUserValid) {
        document.getElementById("authLoader").style.display = "none";
    }
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    signOut(auth).then(() => window.location.replace("index.html"));
});