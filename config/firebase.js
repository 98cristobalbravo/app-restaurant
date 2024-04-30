// firebase.js
import { initializeApp } from "@firebase/app";

// Database data 
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId:"",
    appId: "",
  };
  
  // Inicializar Firebase
  const app = initializeApp(firebaseConfig);

  export default app;
