import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
   //TÄHÄN API KEYS
  };
  
  // Initialize Firebase
 initializeApp(firebaseConfig);

 const firestore = getFirestore();

 export{
    firestore
 }