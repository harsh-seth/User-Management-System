# User Management System

## About
A small REST API server and a single page webapp consuming these endpoints. The project facilitates the creation and management of users. The project is written in `Node` and it interfaces with a `MySQL` instance.

## Features
+ Search the database for Users
    + This can be done in two modes
    + If no query was passed to `GET /user`, then every user in the database is listed
    + If an email ID is passed to `GET /user` as an argument, then the database is searched for that particular user
+ Create a new User or Update an existing User
    + The form provided has the fields required to be entered for every User
    + For creating a new User, all fields are mandatory
    + For updating an existing User, only those fields which are filled will be updated, all previous information will remain as is
    + The email ID will determine if the action to perform is a create or an update. If the email ID exists in the database, it will be an update operation.
    + It is done via `POST /user`
+ Remove a User from the database
    + By passing a valid and existing email ID to `DELETE /user`, Users can be removed from the database
    + The webpage asks for confirmation before performing this action

## Installation Instructions
+ Clone the repository onto your local machine by running the command

    `git clone https://github.com/harsh-seth/User-Management-System.git`
+ Navigate into the folder with the project files by running the command
    `cd user-management-system`
+ Run ```npm install``` in the command prompt/terminal. It should fetch the `express`, `joi`, `mysql` and `pug` packages and install them locally. 
+ In case the database connection credentials have to be changed, open `db.js` and replace the relevant constants (`HOST`, `USER`, `PASSWORD`, `DATABASE`) with the updated values
+ Your copy of the project should be good to go. Simply run `node server.js` to start an instance of the project.
+ You will be able to access the webapp on `http://localhost:3000`

## Notes
+ According to REST API design principles, the API spec should be of the format `POST /user` (or  `PUT /user`), `GET /user` and `DELETE /user`

+ The decision for `POST` or `PUT` for creating and updating users was a design choice. `POST` was selected primarily because `HTML` doesn't support `PUT` natively.

+ Due to the limitations of `HTML5` forms, the `DELETE` operation had to done via `jQuery` workarounds (specifically via `ajax`)

+ Validations were done on two levels, once on the client end via `HTML5` input types and once on the server end. This was done to make the server capable of running stand-alone and still enforce input value formats. By setting up a `joi` instance, validation on the server side becomes an easy task.

+ `Pug` was selected as the view engine to allow for a dynamic webpage, capable of giving rich feedback to the user. The portal was designed to be a single page app, with the different endpoints consumed by this app.

+ The messages to display to the user were standardized and made reusable. It allows for a consistent UI/UX

+ The development process for the application closely resembles the MVC design principles and was as follows:
    + Designing and creating endpoints capable of accepting inputs and returning token responses
    + Created webpage, decided upon the metaphors for the endpoints and implemented the different interfaces to the server (i.e. the Create/Modify User form, the Search User form, the Delete User form)
    + Implemented form input validations and finalized the different possible outcome states for the webpage
    + Set up database connections with a dummy database having the same schema as the production one
    + Replaced the dummy logic with the actual business logic (i.e. database operations)
    + Refined and finalized the look of the webpage by incorporating Bootstrap design 
    + Replaced the database credentials with the production database. 
    + Performed a round of tests to see if all features work, without changing the state of the database

+ The database connection configuration was written in a separate file named `db.js`. This is isolate the database connection secrets from the main project. Should the user wish to do so, the secrets can be saved as environment variables or in a text file. `db.js` can then be modified to pick up the values from those sources instead, without worrying about the main project.

+ Initially, all database connection and operations testing was done with a local instance of `MySQL` having the same schema as the online one. Once the application was finalized, the connection parameters were changed to query from the online database instead. 

+ To learn how to interface the database with the application, the official documentation of the `mysql` module for `Node` was consulted.

+ The server only launches after a connection has been established with the database.

+ While initially, `styles.css` has more styles, many were replaced by the ones provided by Bootstrap
