const admin = require("firebase-admin");
const functions = require('firebase-functions')

//require("firebase/firestore");

admin.initializeApp(functions.config.firebase)

const db = firebase.firestore()
// const auth = firebase.auth()
// const storageRef = firebase.storage().ref()

module.exports = {
   

}