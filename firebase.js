import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8ucX2SaLBNaqrVMZRyrm-HeE4k3FMz1c",
  authDomain: "theaterapp-f8161.firebaseapp.com",
  projectId: "theaterapp-f8161",
  storageBucket: "theaterapp-f8161.firebasestorage.app",
  messagingSenderId: "639404040075",
  appId: "1:639404040075:web:7fa9182b6112eb0c16198e",
  measurementId: "G-QVGPPRDEPW"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

