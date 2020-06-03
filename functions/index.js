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

main.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

// temp form
main.get('/form', (req, res) => {
    res.render('form')
})

main.get('/form/1', (req, res) => {
    res.render('form/academic_detail')
})

main.get('/form/2', (req, res) => {
    res.render('form/file_upload')
})

main.get('/form/3', (req, res) => {
    res.render('form/personal_detail')
})

main.get('/response', (req, res) => {
    res.render('submitresponse')
})

// real form
// main.get('/form', (req, res) => {
//     res.render('form/academic_details')
// })

// temp login
main.get('/login', (req, res) => {
    res.render('login')
})

// real login
// main.get('/login', (req, res) => {
//     res.render('login_signup/signin')
// })

main.get('/signup', (req, res) => {
    res.render('login_signup/signup')
})

require('./routes')(app)
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome'
}))

exports.webApi = functions.https.onRequest(main)