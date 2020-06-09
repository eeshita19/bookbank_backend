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

require('./routes')(app)
app.get('*', (req, res) => {
    res.redirect('/login')
})

main.get('*', (req, res) => {
    res.redirect('/login')
})

app.post('*', (req, res) => {
    res.redirect('/login')
})

main.post('*', (req, res) => {
    res.redirect('/login')
})

exports.webApi = functions.https.onRequest(main)