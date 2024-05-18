# True Mates Challenge

## Requirement 1

### *1.*
To build my express app, I used Node and NPM as my package manager to initialize an environment. I installed the necessary dependecies such as express, sequelize, pg, and nodemon for development. I broke my file structure to be organized and include folders such as models, controllers, routes, middleware, migrations, and others for easy access. App.js is where we define our express app and import all the routers. In index.js is where our application will listen for requests. 

In order to create the PostgreSQL database, I had to create an instance through GCP Cloud SQL and configure it for this purpose. I created a seperate database called 'testmates' and a 'tester' user for this purpose as well. Utilizing sequelize I connected to the GCP database for our use by connecting to the public url and enabling my network to be an allowed connection. 

### *2.*
In order for users to register I created a new router called users and a POST route for users where we can send requests by providing the name, email, and password in the request body. I made these required fields by utilizing sequelize and defining that these are non-null columns when creating the User model and migration. Passwords are also hashed and those hashed passwords to saved to the database utilzing bcrypts.

![Register](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/099f6b09-f3bf-49ad-8377-e7a5ee415681)

### Errors
Throws an error when no password is provided as this will cause bcrypt to fail.

![no_password_register](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/7a0981b5-a7aa-4320-a869-655f6bf9aa9a)

Throws an error when we are missing either email or name by using sequelize's Validation error

![missing_email_name_register](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/4cf6f302-59a1-4167-9fc5-9039d544d393)

### *3.*
I created a new POST route for login where you can send requests by providing an email and password in the body. Users are first found by using the email and sequelize findOne method and then we check if the hashed password matches the password provided by using bcrypts. It will return non-sensitive user information and the token in the response.

![Login](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/9b2bf0ec-337e-4704-865d-b3b330729177)

### Errors
Throws an when password or email are undefined.

![no_email_pass_login](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/335fa0d1-1150-4125-92eb-a67e8ce48c30)

Throws an error when a user is not found by the email or the password provided does not match the passwordHash through bcrpyt

![wrong email or pass](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/061da96e-12b1-430c-8cc4-b07029b522c3)

### *4.*
To handle creating posts, we first create a new router for posts and a new route for POST method for posts. We design a model for Posts in our database where we have one to many relationship (users -> posts) while applying these changes to a migration as well. Then we move to GCP and setup a Storage bucket that we will use for this purpose. After creating a service account, applying the neccessary permissions, and creating and downloading a key we can access our new bucket. To upload a photo we make use of Multer and create a middleware with a file size limit. We check if the middleware fails and throw an error if there is no file. Then we create a blob and an upstream and if there are no errors we try to make the file public. If nothing has thrown an error to this point then we create a new Post in the database with the description and new url.

We create two more middleware that will handle user authorization for all requests that require it. The first middleware is called tokenExtractor and its job is to extract out the token from request authorization headers that have strings that start with 'bearer '. We pass this middleware in the main app.js and only ever works when authorization matches the requirements we listed and creates request.token when it succeeds. The second middleware is called userExtractor that checks the extracted token making sure to throw errors if it does not exist or does not pass jwt.verify(). If the token is valid then we set the user information to request.user.

![create post first](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/b1dfe5d3-806e-4f9a-9a79-fdfc8729c0db)

### Errors
If no file was included in the request body then our middleware will return no value which will throw an error.

![no file single file](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/c2c9c892-23ad-457e-8639-5cfd33542e09)

Throws an error that will trigger when a multer code 'LIMIT_UNEXPECTED_FILE' is found. This happens when we try to upload more then one file.

![more then one file](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/f1e0f9e1-a210-49ae-be9a-ff91448bb706)

We have errors that will throw when authorization fails and these are located in our middleware and will trigger for future requests as well.

![no token](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/5bbc2356-03b1-4a04-b8dd-f5df6bd9692e)

![bad token](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/e20e59e1-266a-46c0-bd47-d6971d56f523)

