import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Konfigurasi Firebase - ganti dengan kredensial dari project Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyD2-7ELvtGmP4MNokcZciqee2ud_OmCId4",
  authDomain: "online-shop-a1cef.firebaseapp.com",
  databaseURL: "https://online-shop-a1cef-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "online-shop-a1cef",
  storageBucket: "online-shop-a1cef.appspot.com",
  messagingSenderId: "575749927714",
  appId: "1:575749927714:web:ef6892da9b7d6313b36b7b",
  measurementId: "G-G8L9W2FRPT"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Mendapatkan referensi storage
const storage = getStorage(app);

export { storage };
