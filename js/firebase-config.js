
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDgmgAw5dyqvQL9rZOlwMwM1Wo2SZiFszY",
    authDomain: "de-ve-de-516d8.firebaseapp.com",
    projectId: "de-ve-de-516d8",
    storageBucket: "de-ve-de-516d8.appspot.com",
    messagingSenderId: "45843368818",
    appId: "1:45843368818:web:5a55413292596d2ab8abeb"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  export { db }