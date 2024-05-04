import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
// import bcrypt from "bcrypt"
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4Yj4hAjzYbv9bci1L96TrRcIFJvSBv_I",

  authDomain: "queue-management-7a629.firebaseapp.com",

  databaseURL: "https://queue-management-7a629-default-rtdb.asia-southeast1.firebasedatabase.app",

  projectId: "queue-management-7a629",

  storageBucket: "queue-management-7a629.appspot.com",

  messagingSenderId: "810346611864",

  appId: "1:810346611864:web:e871a1c246a6e9d9a6fced",

  measurementId: "G-GD8L44Y0LM",

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to submit data to Firestore
const submitDataToFirestore = async (collectionName, data) => {
  try {
    data.date = serverTimestamp();
    const docRef = await addDoc(collection(db, collectionName), data);
    // console.log("Data submitted successfully with ID: ", docRef.id);
    return docRef.id; // Return the generated ID
  } catch (error) {
    console.error("Error submitting data: ", error);
    throw error; // Re-throw the error to handle it at the caller level
  }
};



const signIn = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    const isAdmin = email === "admin@tecnavis.com";
    const isCounter = email.startsWith("counter@tecnavis.com");

    if (isAdmin) {
      return "admin";
    } else if (isCounter) {
      return "counter";
    } else {
      throw new Error("Invalid input");
    }
};

const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("Logout Successful");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};
export { auth, db, submitDataToFirestore, signIn, signOutUser };
 