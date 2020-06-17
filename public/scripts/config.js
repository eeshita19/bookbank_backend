// Initialize Firebase
// alert('loaded');

const config = {
    apiKey: "AIzaSyBgtoAqzDTAJU4XB4kr6Qab79tQO4zVWcM",
    authDomain: "bookbank-11bc5.firebase.com",
    databaseURL: "https://bookbank-11bc5.firebaseio.com",
    projectId: "bookbank-11bc5",
    storageBucket: "bookbank-11bc5.appspot.com",
};

firebase.initializeApp(config);

// make auth and firestore references
const auth = firebase.auth();
let db;
try {
    db = firebase.firestore()
} catch (err) {
    console.log('tis ok')
}

let storage;
try {
    storage = firebase.storage();
} catch (err) {
    console.log('tis ok')
}