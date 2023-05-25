// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCpbDjv0YIXj0H_Jv76L0mATPbAofvfzCQ",
	authDomain: "jeremy-dcb6e.firebaseapp.com",
	projectId: "jeremy-dcb6e",
	storageBucket: "jeremy-dcb6e.appspot.com",
	messagingSenderId: "869635396061",
	appId: "1:869635396061:web:b1e45a2300d60b5c0d6634",
	measurementId: "G-B8NZSLZ7JG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
