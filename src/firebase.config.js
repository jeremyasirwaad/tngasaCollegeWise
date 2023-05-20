// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyA9J1T-gRYAN5dC6V9Nr-gaZG23TtbtX6E",
	authDomain: "tngasa-otp.firebaseapp.com",
	projectId: "tngasa-otp",
	storageBucket: "tngasa-otp.appspot.com",
	messagingSenderId: "758898665174",
	appId: "1:758898665174:web:c9ae39ffe26ff482c88b77",
	measurementId: "G-XZDZ1FV9RR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
