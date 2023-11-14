import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import { initializeAuth } from 'firebase/auth';
import { getAuth} from "firebase/auth";
const firebaseConfig = {
   apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID
  };

  // Initialize Firebase
 //const app = initializeApp(firebaseConfig);

 
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 
 const firestore = getFirestore();
 const user = auth.currentUser;
 export{
    firestore, auth, user
 }