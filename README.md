# True Mates Challenge

## Requirement 2

### *1.*
In order to add an attribute to posts when created I first had to change the Post model to include an attribute column with string type. Then I created a new migration that adds the attribute column to the posts table.  I included attribute as part of the body for the post creation request with error handling if not included. In order to consider prior posts to this change, I added a default value for those rows.

Here is an example of a post with the attribute included.

![Attribute](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/9da0f6c2-4107-4a96-9ba3-e7c5b4a127d6)

Here is an example of an older post that incorporates the default value.

![attribute_default](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/e2fb09e1-8705-4f93-a89b-a261fd7109e2)

Included an error if attribute is not included in the post creation.

![no_attribute](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/702f6442-ffbe-4a3b-8d53-6d11341504ea)

### *2.*
The first step was to create a new get request for the post router that will return a post by id. I handled errors if the post is not found with the id and if the id is not the right type. I had already included timestamps when creating Posts by utilzing sequelize and found the time difference in milliseconds by utilzing Date object method getTime(). I found the conversions for all the different types of times by converting the difference between now and the post creation time in milliseconds and converting to all different time units. I used conditionals to determine which one would be the most appropiate to display, starting from seconds working up to years.

Here is a photo of post 47 from 8 minutes after creation

![Time Diff](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/2eccf5dc-0b45-4ac8-b0d0-8a17ef26d6e4)

Here is the updated time difference after about a day after creation

![time diff update](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/3dac7825-4f8c-4cb8-9552-e599567470d2)

### Errors
When the id is not found because it doesn't exist

![post_dne](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/82c977d0-8642-44f1-99e6-674aefa6ea8b)

When the id is the incorrect typing.

![postid_string](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/b2fec645-0bad-4e27-9330-501077a89195)

### *3.*
To start out, I had to reconsider my database setup because I had the photo url as a column in Post table. To incorporate more photos I thought it would be best to create a new table for photos where they would have a one to many relationship with posts, through postId. I created a new model and migration which included columns post_id and url where post_id references the id from post table. The Post table now does not include information in the photo column by making it allow null values and I changed the column to include nulls as part of the migration. This allows for previous posts with one photo to keep their column and new posts to just have a null value.

Next I had to alter the post creation request. To consider files with the same name I decided to add a prefix-tag to the filename with something like 'user-1_' to represent a user with id 1 which made every url unique.  I had to adjust multer to account for multiple files by instead utilizing its array method instead of single method. I looped through each file to create a writing stream for each one and packaged each writing stream into a new Promise. I grouped them all into an array of promises and waited for all of them to execute. Part of this process included creating a new Photo in the table with the necessary url and postId. Posts did not require photos and posts without photos do not create any entries in the photos table resulting in a response of an empty photos array. In the response we include a post object for our post information and a photos array that handles an array of photo objects.

![new post with photos](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/3aa4d103-7dcf-401d-9033-5a5cc37a98d5)

Here are the urls of the photos to check:

http://storage.googleapis.com/true-mates-bucket/user-1_dog-puppy-on-garden-royalty-free-image-1586966191.jpg
http://storage.googleapis.com/true-mates-bucket/user-1_ai-generative-cute-cat-isolated-on-solid-background-photo.jpg

### Errors
Errors relating to photos were check using multer's error codes. The first is when there are more then 5 files and the second is when the file is too large past our 5mb limit. Another error is when public access is denied from GCP permissions.

![file limit](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/21a4deb4-f52b-449e-b60a-0a6f0c19d84f)

![file_size](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/8a531667-b18b-41f9-bc30-acf28481eed2)

### *4.*
Created a new route and controller for modifying a post. With a PUT request, we passed a necessary description to the body and a post id to params. We pass the userExtractor middleware that makes sure we have an user token before we process the request. If the post is found then we simply update the the post and save the changes with sequelize save(). Lastly, we search for photos with the post id and return photos associated with the post and the post info as well.

![change_desc](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/1b9ea8b8-ee52-4259-ad5a-fcdd35e9218b)

### Errors
One error is when we pass a numeric post id that does not exist

![post_dne_des](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/7487de5c-0bb4-4c9a-aa82-313c9615bfa2)

Throws an error when the post id is not the right type

![desc_string](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/92c661a2-c268-434c-8fb2-800542dcae06)

Throws an error when the user making the request does not match the post's user id

![description_wrong_user](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/763268d0-06ef-4397-aa9d-37b684079705)

Throws an error when no description provided

![no desc](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/46ec14aa-893b-425e-b8f0-66dd289df9ee)

﻿# True Mates Challenge

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

