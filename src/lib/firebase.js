import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDCCDH3ZOPkPnPiO84hNWhZb8VPFSaPCYQ",
    authDomain: "radiant-raceway-428719-v0.firebaseapp.com",
    databaseURL: "https://radiant-raceway-428719-v0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "radiant-raceway-428719-v0",
    storageBucket: "radiant-raceway-428719-v0.appspot.com",
    messagingSenderId: "935368220795",
    appId: "1:935368220795:web:9264bfbc9acc2ef09fc2de",
    measurementId: "G-FGG9XPHZEJ"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
