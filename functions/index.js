const functions = require('firebase-functions')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()
const main = express()

main.use('/api/v1', app)
main.use(bodyParser.json())

main.use(express.static(path.join(__dirname, "../public")))

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

main.get('/admin/login', (req, res) => {
    res.render('admin/login')
})

main.get('/admin', (req, res) => {
    res.render('admin/index')
})

main.get('/admin/cust', (req, res) => {
    res.render('admin/customer')
})

main.get('/admin/userinfo', (req, res) => {
    res.render('admin/userinfo')
})

main.get('/admin/userinfo1', (req, res) => {
    res.render('admin/userinfo1')
})

main.get('/admin/userinfo2', (req, res) => {
    res.render('admin/userinfo2')
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