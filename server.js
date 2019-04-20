var express = require('express')
var app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app.use(express.static('./public'))

// app.set('views', './views')
// app.set('view engine', 'pug')

const portNum = 3000

app.get('/', (req, res) => {
    res.send({'message': 'Server works!'})
})

app.listen(portNum, () => console.log("Server's up at", portNum))