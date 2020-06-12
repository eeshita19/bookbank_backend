const admin = require("firebase-admin")
const functions = require('firebase-functions')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bookbank-11bc5.firebaseio.com"
});

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

//login-register routes
main.get('/login', (req, res) => {
    res.render('login/signin')
})

main.get('/register', (req, res) => {
    res.render('login/signup')
})

//otp
main.get('/phone', (req, res) => {
    res.render('login/phone_verification')
})

main.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

//form routes
main.get('/form/personal', (req, res) => {
    res.render('form/personal_detail')
})

main.get('/form/academic', (req, res) => {
    res.render('form/academic_detail')
})

main.get('/form/file', (req, res) => {
    res.render('form/file_upload')
})

main.get('/response', (req, res) => {
    res.render('submitresponse')
})

main.get('/congratulations', (req, res) => {
    res.render('congratulations')
})

main.get('/activated', (req, res) => {
    res.render('activated')
})

main.get('/admin/login', (req, res) => {
    res.render('admin/login')
})

main.get('/admin', (req, res) => {
    res.render('admin/index')
})

main.get('/admin/cust', (req, res) => {
    res.render('admin/customer')
})

main.get('/admin/add', (req, res) => {
    res.render('admin/createAdmin')
})

main.get('/admin/userinfo/:id', async (req, res) => {
    let uid = req.params.id
    let valid
    let username
    await admin.auth().getUser(uid)
        .then((data) => {
            if (data.emailVerified === false) {
                valid = "NOT VERIFIED"
            } else {
                valid = "VERIFIED"
            }
            username = data.displayName
            return valid
        })
        .catch((error) => {
            console.log(error)
        })
    res.render('admin/userinfo', {
        state: valid,
        username: username
    })
})

main.get('/admin/userinfo1/:id', async (req, res) => {
    let uid = req.params.id
    let username

    await admin.auth().getUser(uid)
        .then((data) => {
            username = data.displayName
            return username
        })
        .catch((error) => {
            console.log(error)
        })
    res.render('admin/userinfo1', {
        username: username
    })
})

main.get('/admin/userinfo2/:id', async (req, res) => {
    let uid = req.params.id
    let username
    await admin.auth().getUser(uid)
        .then((data) => {
            username = data.displayName
            return username
        })
        .catch((error) => {
            console.log(error)
        })
    res.render('admin/userinfo2', {
        username: username
    })
})

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

main.get('*', (req, res) => {
    res.redirect('/login')
})

main.post('*', (req, res) => {
    res.redirect('/login')
})