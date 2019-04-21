var express = require('express')
var app = express()
var joi = require('joi')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('./public'))

app.set('views', './views')
app.set('view engine', 'pug')


const validators = {
    'userForm': {
        'username': joi.string().trim().required(),
        'password': joi.string().required(),
        'email': joi.string().trim().email().required(),
        'phoneNumber': joi.string().trim().regex(/^^[1-9][0-9]{9,10}$/).required()
    },
    'email': {
        'email': joi.string().trim().email()
    }
}

const messages = {
    'invalidParams': "Something went wrong!",
    'missingParams': "Some required parameters were missing!",
    'userDNE': "No such user exists in database!",
    'userCreatedOK': "User created!",
    'userUpdatedOK': "User updated!",
    'userDeletedOK': "User deleted from database!",
    'invalidURL': "The requested URL does not exist",
    'genError': "Whoops, something went wrong! Try again."
}

const portNum = 3000

// Serves the page to the user
app.get('/', (req, res) => {
    res.render('userManagement')
})

// To get details of users. Passing a parameter will get one user, or else every user 
app.get('/user', (req, res) => {
    if (req.query['email']) {
        // Details of a single user requested
        
        // Performing validations
        var results = joi.validate(req.query, validators['email'])

        if(results.error) {
            // Invalid request parameters
            res.status(400).render('userManagement', {'searchError': messages['invalidParams']  + " (" + results.error.details[0].message + ")"})
        } else {
            // No validation errors

            // Check if user exists
            // res.status(404).render('userManagement', {'searchError': messages['userDNE']})

            res.render('userManagement', {'users': [{'username': 'abc', 'email': 'mb', 'phoneNumber': 'kn', 'dateTime': new Date()}]})
        }
    } else {
        // Details of all users requested

        // Get all user details

        res.render('userManagement', {'users': [{'username': 'abc', 'email': 'mb', 'phoneNumber': 'kn', 'dateTime': new Date()}, {'username': 'abc', 'email': 'mb', 'phoneNumber': 'kn', 'dateTime': new Date()}]})
    }
})

// To create a new user on the database
app.post('/user', (req, res) => {
    var data = req.body
    // Performing validations
    var results = joi.validate(data, validators['userForm'])

    if (results.error) {
        // Invalid request parameters
        if (results.error.details[0].context.key == 'phoneNumber')
            res.status(400).render('userManagement', {'createOrUpdateError': messages['invalidParams']  + " (Phone number is not in the right format)"})
        else 
            res.status(400).render('userManagement', {'createOrUpdateError': messages['invalidParams'] + " (" + results.error.details[0].message + ")"})
    } else {
        // No validation errors

        // Check if user exists
        
        // Update user
        // res.render('userManagement', {'createOrUpdateSuccess': messages['userUpdatedOK']})
        
        // Create new user
        res.render('userManagement', {'createOrUpdateSuccess': messages['userCreatedOK']})
    }
})

app.delete('/user', (req, res) => {
    if (req.query['email']) {
        // Performing validations
        var results = joi.validate(req.query, validators['email'])

        if(results.error) {
            // Invalid request parameters
            res.status(400).send({'message': messages['invalidParams']  + " (" + results.error.details[0].message + ")"})
        } else {
            // No validation errors

            // Check if user exists
            res.status(404).send({'deleteError': messages['userDNE']})

            // res.send({'deleteSuccess': messages['userDeletedOK']})
        }
    } else {
        // Email parameter wasn't passed! 
        res.status(400).send({'message': messages['missingParams']})
    }
})

// Invalid URL catchers
app.get('*', (req, res) => res.status(404).send({'message': messages['invalidURL']}))

app.post('*', (req, res) => res.status(404).send({'message': messages['invalidURL']}))

app.put('*', (req, res) => res.status(404).send({'message': messages['invalidURL']}))

app.delete('*', (req, res) => res.status(404).send({'message': messages['invalidURL']}))

app.listen(portNum, () => console.log("Server's up at", portNum))