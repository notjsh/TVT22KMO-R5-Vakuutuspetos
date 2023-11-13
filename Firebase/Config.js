import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
   //test
  };
  
  // Initialize Firebase
 initializeApp(firebaseConfig);

 const firestore = getFirestore();

 export{
    firestore
 }