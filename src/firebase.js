import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCPWCwIeUO2t_5ikeFWUV90mL2YOaCJ8VM",
    authDomain: "ecommerce-e53f3.firebaseapp.com",
    projectId: "ecommerce-e53f3",
    storageBucket: "ecommerce-e53f3.appspot.com",
    messagingSenderId: "852995365285",
    appId: "1:852995365285:web:51ad034f517ff9e487704c"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
