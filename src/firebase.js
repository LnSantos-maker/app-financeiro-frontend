import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBe83EzQD1D2ms9P1kqbtcSoC8M2WWR62g",
  authDomain: "planejamento-financeiro-26e9b.firebaseapp.com",
  projectId: "planejamento-financeiro-26e9b",
  storageBucket: "planejamento-financeiro-26e9b.firebasestorage.app",
  messagingSenderId: "343450085414",
  appId: "1:343450085414:web:0f35552f4ba667472f1ee7",
  measurementId: "G-VRP8LK7TED"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);