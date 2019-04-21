var mysql = require('mysql')

var HOST = 'localhost'
var USER = undefined
var PASSWORD = undefined
var DATABASE = 'db_intern' 

var connection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
})

exports.connection = connection
