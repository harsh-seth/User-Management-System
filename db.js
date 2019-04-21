var mysql = require('mysql')

var HOST = 'db-intern.ciupl0p5utwk.us-east-1.rds.amazonaws.com'
var USER = 'dummyUser'
var PASSWORD = 'dummyUser01'
var DATABASE = 'db_intern' 

var connection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
})

exports.connection = connection
