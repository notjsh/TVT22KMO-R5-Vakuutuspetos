import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
   
  };
  
  // Initialize Firebase
 initializeApp(firebaseConfig);

 const firestore = getFirestore();

 export{
    firestore
 }