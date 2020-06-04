const functions = require('firebase-functions')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()
const main = express()

main.use('/api/v1', app)
main.use(bodyParser.json())

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

main.set('view engine', 'ejs')

//login-register routes
main.get('/login', (req, res) => {
    res.render('login/signin')
})

main.post('/login', (req, res) => {
    res.redirect('/dashboard')
})

main.get('/register', (req, res) => {
    res.render('login/signup')
})

main.post('/register', (req, res) => {
    res.redirect('/phone')
})

//otp
main.get('/phone', (req, res) => {
    res.render('login/phone_verification')
})

main.post('/phone', (req, res) => {
    res.redirect('/otp')
})

main.get('/otp', (req, res) => {
    res.render('login/otp_verification')
})

//landing page
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

// temp form
main.get('/form', (req, res) => {
    res.render('form')
})

// temp login
main.get('/login', (req, res) => {
    res.render('login')
})

require('./routes')(app)
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome'
}))

exports.webApi = functions.https.onRequest(main)