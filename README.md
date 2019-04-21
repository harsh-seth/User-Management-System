Notes
+ According to REST API design principles, the API spec should be of the format `POST /user` (or  `PUT /user`), `GET /user` and `DELETE /user`

+ The decision for `POST` or `PUT` for creating and updating users was a design choice. `POST` was selected primarily because `HTML` doesn't support `PUT` natively.

+ Due to the limitations of `HTML5` forms, the `DELETE` operation had to done via `jQuery` workarounds (specifically via `ajax`)

+ Validations were done on two levels, once on the client end via `HTML5` input types and once on the server end. 

+ By setting up a `joi` instance, validation on the server side becomes an easy task.

+ `Pug` was selected as the view engine to allow for a dynamic webpage, capable of giving rich feedback to the user 

+ The portal was designed to be a single page app, with the different endpoints consumed by this app.

+ First created endpoints, then created webpage, then did validations, then made business logic (i.e. db connections)