import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getAuth,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

onAuthStateChanged(auth,(user)=>{

if(!user){

alert("Please Login First");

window.location.href="index.html";

}

});

document
.getElementById("createHotelBtn")
.addEventListener("click", async ()=>{

const hotelName =
document.getElementById("hotelName").value;

const ownerName =
document.getElementById("ownerName").value;

const mobile =
document.getElementById("mobile").value;

const whatsapp =
document.getElementById("whatsapp").value;

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

const address =
document.getElementById("address").value;

const city =
document.getElementById("city").value;

const state =
document.getElementById("state").value;

const country =
document.getElementById("country").value;

const maps =
document.getElementById("maps").value;

const website =
document.getElementById("website").value;

const facebook =
document.getElementById("facebook").value;

const instagram =
document.getElementById("instagram").value;

const plan =
document.getElementById("plan").value;

const startDate =
document.getElementById("startDate").value;

const status =
document.getElementById("status").value;

if(
hotelName === "" ||
ownerName === "" ||
mobile === "" ||
email === ""
){

alert("Please Fill Required Fields");

return;

}

try{

await addDoc(
collection(db,"hotels"),
{
hotelName,
ownerName,
mobile,
whatsapp,
email,
password,
address,
city,
state,
country,
maps,
website,
facebook,
instagram,
plan,
startDate,
status,
createdAt: serverTimestamp()
}
);

alert("Hotel Added Successfully");

document.getElementById("hotelName").value="";
document.getElementById("ownerName").value="";
document.getElementById("mobile").value="";
document.getElementById("whatsapp").value="";
document.getElementById("email").value="";
document.getElementById("password").value="";
document.getElementById("address").value="";
document.getElementById("city").value="";
document.getElementById("state").value="";
document.getElementById("country").value="";
document.getElementById("maps").value="";
document.getElementById("website").value="";
document.getElementById("facebook").value="";
document.getElementById("instagram").value="";

}catch(error){

alert(error.message);

console.log(error);

}

});
