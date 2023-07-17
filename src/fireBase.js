import { initializeApp } from "firebase/app";
import {getAuth, 
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword} from 'firebase/auth';
import {getFirestore, addDoc, collection} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'        


// collection >> 예를 들어 nweets를 뜻함
// doc >> 예를 들어 nweets 안의 creatorId, createAt, text 같은 정보를 담고 있는 객체 중 하나?

const firebaseConfig = {
    apiKey: "AIzaSyCoEodHugUALajViDDU6ODFq8ARymHFmtk",
    authDomain: "react-nwitter-d1046.firebaseapp.com",
    projectId: "react-nwitter-d1046",
    storageBucket: "react-nwitter-d1046.appspot.com",
    messagingSenderId: "204952247752",
    appId: "1:204952247752:web:44ef8a609120335cccf4fd"
  };
  
  // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const authService = getAuth(firebaseApp);

export const dbService = getFirestore();
export const dbAddDoc = addDoc;
export const dbCollection = collection;
export const storageService = getStorage();

export {createUserWithEmailAndPassword, signInWithEmailAndPassword};
export default authService;
