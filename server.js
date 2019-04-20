var express = require('express')
var app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('./public'))

app.set('views', './views')
app.set('view engine', 'pug')

const portNum = 3000
var pageViews = 0

app.get('/', (req, res) => {
    pageViews += 1
    res.render('userManagement', {pageViews: pageViews})
})

app.listen(portNum, () => console.log("Server's up at", portNum))