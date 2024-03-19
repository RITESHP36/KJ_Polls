// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAHktmE86XTopE2GRwwflZ6-2Armr_qTPU",
	authDomain: "kjpolls.firebaseapp.com",
	projectId: "kjpolls",
	storageBucket: "kjpolls.appspot.com",
	messagingSenderId: "809228527004",
	appId: "1:809228527004:web:20c59a7def76dab683d459",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
