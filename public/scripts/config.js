// Initialize Firebase
// alert('loaded');

const config = {
    apiKey: "AIzaSyBgtoAqzDTAJU4XB4kr6Qab79tQO4zVWcM",
    authDomain: "bookbank-11bc5.firebaseapp.com",
    databaseURL: "https://bookbank-11bc5.firebaseio.com",
    projectId: "bookbank-11bc5",
    storageBucket: "bookbank-11bc5.appspot.com",
};

const firebaseApp = firebase.initializeApp(config);

// make auth and firestore references
const auth = firebaseApp.auth();
const db = firebaseApp.firestore();
const storage = firebaseApp.storage();