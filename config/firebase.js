// firebase.js
import { initializeApp } from "@firebase/app";

// Database data 
const firebaseConfig = {
    apiKey: "AIzaSyBWIMoTfaVeuKPqk9taDeIOHW33NhcfznU",
    authDomain: "database-restaurant-d00cc.firebaseapp.com",
    databaseURL: "https://database-restaurant-d00cc-default-rtdb.firebaseio.com",
    projectId: "database-restaurant-d00cc",
    storageBucket: "database-restaurant-d00cc.appspot.com",
    messagingSenderId: "880437781649",
    appId: "1:880437781649:web:a147e27d16b70dbe3e8b30"
  };
  
  // Inicializar Firebase
  const app = initializeApp(firebaseConfig);

  export default app;