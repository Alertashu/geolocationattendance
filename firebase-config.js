// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyBhO-97DE4uFPHpBbr0vOXnJ1oNU5MTUSw",
  authDomain: "geotrackers-e0ce7.firebaseapp.com",
  projectId: "geotrackers-e0ce7",
  storageBucket: "geotrackers-e0ce7.appspot.com",
  messagingSenderId: "404934301450",
  appId: "1:404934301450:web:4aef6b4b49a92c16d24cf3"
};

firebase.initializeApp(firebaseConfig);
firebase.auth();
firebase.firestore();
firebase.storage();