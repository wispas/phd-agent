import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPSVBRQgBbteHHDUXi_mb70j3hKtdBOLU",
  authDomain: "phd-agent-11840.firebaseapp.com",
  projectId: "phd-agent-11840",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);