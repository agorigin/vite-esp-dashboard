import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAwGP0y_fcGTz3zKBzZAmxnHraK-Vl8gus",
  authDomain: "angles-tracker.firebaseapp.com",
  projectId: "angles-tracker",
  appId: "1:305126848120:web:11d50157f63c91892f5f8d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


// const firebaseConfig = {
//     apiKey: "AIzaSyAwGP0y_fcGTz3zKBzZAmxnHraK-Vl8gus",
//     authDomain: "angles-tracker.firebaseapp.com",
//     projectId: "angles-tracker",
//     storageBucket: "angles-tracker.firebasestorage.app",
//     messagingSenderId: "305126848120",
//     appId: "1:305126848120:web:11d50157f63c91892f5f8d",
//     measurementId: "G-0TFF0J4C9K"
//   };