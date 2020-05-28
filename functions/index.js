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

app.get('/', (req, res) => {
    res.render('main')
})

app.get('/form', (req, res) => {
    res.render('form')
})

require('./routes')(app)
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome'
}))

exports.webApi = functions.https.onRequest(main)