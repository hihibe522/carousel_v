import firebase from 'firebase/app';
import 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "gggg-aa2e0.firebaseapp.com",
  databaseURL: "https://gggg-aa2e0.firebaseio.com",
  projectId: "gggg-aa2e0",
  storageBucket: "gggg-aa2e0.appspot.com",
  messagingSenderId: "288700839466",
  appId: "1:288700839466:web:91db709452e28759297553",
  measurementId: "G-93JRW4G6GG"
};

// Get a Firestore instance
const firebaseApp = firebase.initializeApp(firebaseConfig);


export const db = firebaseApp ;
