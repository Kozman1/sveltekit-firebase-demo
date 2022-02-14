
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBwUya0Amkv-ZftwmbYzgk2duwWhUqQqTc",
    authDomain: "svelte-firebase-demo-8ecfb.firebaseapp.com",
    projectId: "svelte-firebase-demo-8ecfb",
    storageBucket: "svelte-firebase-demo-8ecfb.appspot.com",
    messagingSenderId: "219195870687",
    appId: "1:219195870687:web:ea8a2181652428e3cfc86a"
}

export default async function initFirebase() {
    const firebase = initializeApp(firebaseConfig);    
    return firebase;
}
