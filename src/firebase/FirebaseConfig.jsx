// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaVKJjJYLxqBn8h2t-hYADiVVPDRXPoAo",
  authDomain: "my-blog-app-b7b3e.firebaseapp.com",
  projectId: "my-blog-app-b7b3e",
  storageBucket: "my-blog-app-b7b3e.appspot.com",
  messagingSenderId: "810411867187",
  appId: "1:810411867187:web:7538d8507292e4cc257746"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fireDb = getFirestore(app);
const storage = getStorage(app);

export {auth,fireDb,storage}