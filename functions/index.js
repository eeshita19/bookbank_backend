const admin = require("firebase-admin")
const functions = require('firebase-functions')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const serviceAccount = require("./serviceAccount.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bookbank-11bc5.firebaseio.com"
});

const db = admin.firestore()
const main = express()

main.use(bodyParser.json())
main.use(bodyParser.urlencoded({
    extended: true
}))

// public is already exposed by default 
// no idea why do this 
main.use(express.static(path.join(__dirname, "../public")))

main.set('views', path.join(__dirname, 'views'))
main.set('view engine', 'ejs')

require('./routes/index')(main)
require('./routes/admin')(main)

main.get('*', (req, res) => {
    res.redirect('/login')
})

main.post('*', (req, res) => {
    res.redirect('/login')
})

// cloud functions
exports.webApi = functions.https.onRequest(main)

exports.addAdminRole = functions.https.onCall((data, context) => {
    // check request is made by an admin
    if (context.auth.token.admin !== true) {
        return {
            error: 'Only admins can add other admins'
        }
    }
    // get user and add admin custom claim
    return admin.auth().getUserByEmail(data.email).then(user => {
        // save in firestore for ease of access
        db.collection("admins").doc(user.uid)
            .set({
                isAdmin: true,
                isHead: false
            }).catch(err => {
                return err
            })
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        })
    }).then(() => {
        return {
            message: `Success! ${data.email} has been made an admin.`
        }
    }).catch(err => {
        return err
    })
})

exports.deleteAdmin = functions.https.onCall((data, context) => {
    // check request is made by an admin
    if (context.auth.token.admin !== true) {
        return {
            error: 'Only main admin can delete other admins'
        }
    }
    // get user and add admin custom claim
    return admin.auth().getUserByEmail(data.email).then(user => {
        db.collection("admins").doc(user.uid)
            .set({
                isAdmin: false,
            }).catch(err => {
                return err
            })
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: false
        })
    }).then(() => {
        return {
            message: `Success! ${data.email} has been demoted from Admin to User.`
        }
    }).catch(err => {
        return err
    })
})