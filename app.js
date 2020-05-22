const express = require("express")
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

app.use(express.static('config'))

app.set("view engine", "ejs")

app.get("/", function (req, res) {
    res.render("login")
})

app.get("/main", function (req, res) {
    res.render("main")
})

app.get("/form", function (req, res) {
    res.render("form")
})

module.exports = app