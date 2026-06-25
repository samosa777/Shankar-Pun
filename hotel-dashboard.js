import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyBkRWPYZtmjS-lpiojtNtY_6h4IORZ6xjc",
authDomain: "hotel-menu-f25ed.firebaseapp.com",
projectId: "hotel-menu-f25ed",
storageBucket: "hotel-menu-f25ed.firebasestorage.app",
messagingSenderId: "750886705933",
appId: "1:750886705933:web:c3331f1dd8cfc99342ee44"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, async(user)=>{
if(!user){
window.location.href="index.html";
return;
}

const snapshot = await getDocs(collection(db,"hotels"));

snapshot.forEach((doc)=>{
const hotel = doc.data();
if(hotel.email && hotel.email.toLowerCase() === user.email.toLowerCase()){
document.getElementById("welcomeText").innerText = "Welcome Mr. " + hotel.ownerName;
document.getElementById("hotelName").innerText = hotel.hotelName;
document.getElementById("pHotel").innerText = hotel.hotelName || "";
document.getElementById("pOwner").innerText = hotel.ownerName || "";
document.getElementById("pEmail").innerText = hotel.email || "";
document.getElementById("pMobile").innerText = hotel.mobile || "";
document.getElementById("pAddress").innerText = hotel.address || "";
document.getElementById("pCity").innerText = hotel.city || "";
document.getElementById("pState").innerText = hotel.state || "";
document.getElementById("pCountry").innerText = hotel.country || "";
document.getElementById("pPlan").innerText = hotel.plan || "";
document.getElementById("pStatus").innerText = hotel.status || "";
}
});
});