import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCkylcHDgolJ45M4LAaBwfK_-YKJNpbEJI",
    authDomain: "vakuutuspetos-574a9.firebaseapp.com",
    projectId: "vakuutuspetos-574a9",
    storageBucket: "vakuutuspetos-574a9.appspot.com",
    messagingSenderId: "716134935095",
    appId: "1:716134935095:web:8f763e129d6c8383d6edb2"
  };
  
  // Initialize Firebase
 initializeApp(firebaseConfig);

 const firestore = getFirestore();

 export{
    firestore
 }