# True Mates Challenge

## Requirement 1

To build my express app, I used Node and NPM as my package manager to initialize an environment. I installed the necessary dependecies such as express, sequelize, cors, pg, and nodemon for development. In order to create the PostgreSQL database, I had to create an instance through GCP Cloud SQL and configure it for this purpose. I created a seperate database called 'testmates' and a 'tester' user for this purpose as well. Utilizing sequelize I connected to the GCP database for our use. In order to connect and leave the connection open for those who will be testing this, I opened up my authorized networks to everyone and used a simple connection to the host ip and port. In another setting, I would not do this approach but for this I thought it was the quickest method with being on free trial and having this temporary thing.

In order for users to register I created a a POST route for users where we can send requests by providing the name, email, and password in the request body. I made these required fields by utilizing sequelize and defining that these are non-null columns when creating the User model and migration. Passwords are also hashed and those hashed passwords to saved to the database utilzing bcrypts. Error handling is caught with a try/catch block and any missing data is returned by sequelize errors.

![Register](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/099f6b09-f3bf-49ad-8377-e7a5ee415681)

I created a new POST route for login where you can send requests by providing an email and password in the body. Users are first found by using the email and sequelize findOne method and then we check if the hashed password matches the password provided by using bcrypts. An error is thrown if email is not found existing to a User or if password does not match. If no error is found then we use jwt to sign user data and send that as the response.

![Login](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/9b2bf0ec-337e-4704-865d-b3b330729177)

To handle creating posts, we first create a new route for posts and a POST method as well. We design a model for Posts in our database where we have one to many relationship (users -> posts). Then we move to GCP and setup a Storage bucket that we will use for this purpose. After creating a service account, applying the neccessary permissions, and creating and downloading a key we can access our new bucket. To upload a photo we make use of Multer and create a middleware with a file size limit. We check if the middleware fails and throw an error if there is no file. Then we create a blob and an upstream and if there are no errors we try to make the file public. If nothing has thrown an error to this point then we create a new Post in the database with the description and new url.

![create post first](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/b1dfe5d3-806e-4f9a-9a79-fdfc8729c0db)

