const express = require('express')
const joi = require('joi')
const db = require('./db')

var app = express()
const connection = db.connection

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('./public'))

app.set('views', './views')
app.set('view engine', 'pug')


const validators = {
    'userForm': {
        'userName': joi.string().trim().allow('').empty('').default(null),
        'password': joi.string().allow('').empty('').default(null),
        'emailId': joi.string().trim().email().required(),
        'phoneNo': joi.string().trim().regex(/^^[1-9][0-9]{9}$/).allow('').empty('').default(null)
    },
    'newUserForm': {
        'userName': joi.string().trim().required(),
        'password': joi.string().required(),
        'emailId': joi.string().trim().email().required(),
        'phoneNo': joi.string().trim().regex(/^^[1-9][0-9]{9}$/).required()
    },
    'email': {
        'emailId': joi.string().trim().email()
    }
}

const messages = {
    'invalidParams': "Something went wrong!",
    'missingParams': "Some required parameters were missing!",
    'invalidPhoneNumberFormat': "Phone number is not in the right format",
    'userDNE': "No such user exists in database!",
    "noUsers": "No users exist in the database!",
    'userCreatedOK': "User created!",
    'userUpdatedOK': "User updated!",
    'userDeletedOK': "User deleted from database!",
    'invalidURL': "The requested URL does not exist",
    'genError': "Whoops, something went wrong! Try again.",
    'noChanges': "No changes were made"
}

const portNum = 3000

// Serves the page to the user
app.get('/', (req, res) => {
    res.render('userManagement')
})

// To get details of users. Passing a parameter will get one user, or else every user 
app.get('/user', (req, res) => {
    if (req.query['emailId']) {
        // Details of a single user requested
        
        // Performing validations
        var results = joi.validate(req.query, validators['email'])
        var sql = undefined

        if(results.error) {
            // Invalid request parameters
            res.status(400).render('userManagement', {'searchError': messages['invalidParams']  + " (" + results.error.details[0].message + ")"})
        } else {
            // No validation errors

            // Fetch user details, if exists
            sql = "SELECT userName, emailId, phoneNo, dateTime FROM userData WHERE emailID = ?"
            connection.query(sql, [results.value.emailId], (err, records) => {
                if(err) throw err
                if (records.length == 0)
                    res.render('userManagement', {'searchError': messages['userDNE']})
                else
                    res.render('userManagement', {'users': records})
            })
        }
    } else {
        // Details of all users requested
        
        // Get all user details
        sql = "SELECT userName, emailId, phoneNo, dateTime FROM userData"
        connection.query(sql, (err, records) => {
            if(err) throw err
            if (records.length == 0)
                res.render('userManagement', {'searchError': messages['noUsers']})
            else
                res.render('userManagement', {'users': records})
        })
    }
})

// To create a new user on the database
app.post('/user', (req, res) => {
    var data = req.body
    // Performing validations
    var results = joi.validate({'emailId': data.emailId}, validators['email'])
    var sql = undefined

    if (results.error) {
        // Invalid request parameters
        res.status(400).render('userManagement', {'createOrUpdateError': messages['invalidParams'] + " (" + results.error.details[0].message + ")"})
    } else {
        // No email validation errors

        // Check if user exists
        sql = "SELECT * FROM userData WHERE emailId = ?"
        connection.query(sql, [results.value.emailId], (err, records) => {
            if(err) throw err
            if (records.length == 0) {
                // User does not exist! 
                
                // Check if all fields are supplied and are proper
                results = joi.validate(data, validators['newUserForm'])
                if (results.error) {
                    if (results.error.details[0].context.key === 'phoneNo' && results.error.details[0].type === 'string.regex.base') {
                        res.status(400).render('userManagement', {'createOrUpdateError': messages['invalidParams']  + " (" + messages['invalidPhoneNumberFormat'] + ")"})
                    }
                    else 
                        res.status(400).render('userManagement', {'createOrUpdateError': messages['invalidParams'] + " (" + results.error.details[0].message + ")"})
                } else {
                    // Create new user
                    sql = "INSERT INTO userData SET ?"
                    connection.query(sql, results.value, (err, response) => {
                        if(err) throw err
                        res.render('userManagement', {'createOrUpdateSuccess': messages['userCreatedOK']})
                    })
                }
            }
            else {
                // User exists! 
                // Check if all fields are supplied and are proper
                results = joi.validate(data, validators['userForm'])
                if (results.error) {
                    if (results.error.details[0].context.key === 'phoneNo' && results.error.details[0].type === 'string.regex.base')
                        res.status(400).render('userManagement', {'createOrUpdateError': messages['invalidParams']  + " (" + messages['invalidPhoneNumberFormat'] + ")"})
                    else 
                        res.status(400).render('userManagement', {'createOrUpdateError': messages['invalidParams'] + " (" + results.error.details[0].message + ")"})
                } else {
                    // Update user
                    sql = "UPDATE userData SET ? WHERE ?"
                    var emailId = results.value.emailId
                    
                    delete results.value['emailId']
                    // Removing null values
                    var empty = true
                    for (var key in results.value) {
                        if (results.value[key] == null) {
                            delete results.value[key]
                            continue
                        }
                        empty = false
                    }

                    if (empty)
                        res.render('userManagement', {'createOrUpdateSuccess': messages['noChanges']})
                    else {
                        connection.query(sql, [results.value, {emailId: emailId}], (err, response) => {
                            if (err) throw err
                            res.render('userManagement', {'createOrUpdateSuccess': messages['userUpdatedOK']})
                        })
                    }
                }
            }
        })
    }
})

app.delete('/user', (req, res) => {
    if (req.query['emailId']) {
        // Performing validations
        var results = joi.validate(req.query, validators['email'])
        var sql = undefined

        if(results.error) {
            // Invalid request parameters
            res.status(400).send({'deleteError': messages['invalidParams']  + " (" + results.error.details[0].message + ")"})
        } else {
            // No validation errors
            
            // Check if user exists
            sql = "SELECT emailId FROM userData WHERE emailId = ?"
            connection.query(sql, [results.value.emailId], (err, response) => {
                if (err) throw err
                if (response.length == 0) {
                    // User does not exist!
                    res.status(404).send({'deleteError': messages['userDNE']})
                } 
                else {
                    // User exists
                    sql = "DELETE FROM userData WHERE emailId = ?"
                    connection.query(sql, [results.value.emailId], (err, response) => {
                        if (err) throw err
                        res.send({'deleteSuccess': messages['userDeletedOK']})
                    })
                }
            })
        }
    } else {
        // Email parameter wasn't passed! 
        res.status(400).send({'deleteError': messages['missingParams']})
    }
})

// Invalid URL catchers
app.get('*', (req, res) => res.status(404).send({'message': messages['invalidURL']}))

app.post('*', (req, res) => res.status(404).send({'message': messages['invalidURL']}))

app.put('*', (req, res) => res.status(404).send({'message': messages['invalidURL']}))

app.delete('*', (req, res) => res.status(404).send({'message': messages['invalidURL']}))


connection.connect(err => {
    if (err) throw err
    console.log("Connected to DB")
    app.listen(portNum, console.log("Server's up at port", portNum))
})
