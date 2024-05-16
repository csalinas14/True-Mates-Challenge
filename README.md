﻿# True Mates Challenge

## Requirement 2

1. In order to add an attribute to posts when created I first had to change the Post model to include an attribute column with string type. Then I created a new migration that adds the attribute column to the posts table.  I included attribute as part of the response body for the post creation request with error handling if not included. In order to consider prior posts to this change, I added a default value for those rows.

![Attribute](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/9da0f6c2-4107-4a96-9ba3-e7c5b4a127d6)

2. The first step was to create a new get request for the post router that will return a post by id. I handled errors if the post is not found with the id and if the id is not the right type. I had already included timestamps when creating Posts by utilzing sequelize and found the time difference in milliseconds by utilzing Date object. I found the conversions for all the different types of times and used conditionals to determine which one would be the most appropiate.

![Time Diff](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/2eccf5dc-0b45-4ac8-b0d0-8a17ef26d6e4)

3. To start out, I had to reconsider my database setup because I had the photo url as a column in Post table. To incorporate more photos I thought it would be best to create a new table for photos where they would have a one to many relationship with posts, through postId. When the new table was set I had to alter the post creation request. To consider files with the same name I decided to add a pre-tag to the filename with something like 'user-1' to represent a user with id 1 which made every url unique.  I had to adjust multer to account for multiple files and looped through each file to create a writing stream for each one. I grouped each writing stream into an array of promises and waited for all of them to execute. Part of this process included creating a new Photo in the table with the necessary url and postId. The new Post now does not include information in the photo column and I changed the column to include nulls as part of the migration. We will keep the column until we transfer data from previous posts to the new Photo table. Posts did not require photos and posts without photos do not create any entries in the photos table. Lastly, we accounted for errors like too many files being passed with multer.

![Mult Photos](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/125884ac-81c7-470a-a36e-1bcc25fcc4b3)

4. Created a new route and controller for modifying a post. With a PUT request, we passed a necessary description to the body and a post id to params. We check for errors by making sure there is a description, the id finds a Post, or the id is the incorrect type.

![Change Des](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/8116c234-9bad-41c9-abaf-b464413644bc)

## Requirement 1

To build my express app, I used Node and NPM as my package manager to initialize an environment. I installed the necessary dependecies such as express, sequelize, cors, pg, and nodemon for development. In order to create the PostgreSQL database, I had to create an instance through GCP Cloud SQL and configure it for this purpose. I created a seperate database called 'testmates' and a 'tester' user for this purpose as well. Utilizing sequelize I connected to the GCP database for our use. In order to connect and leave the connection open for those who will be testing this, I opened up my authorized networks to everyone and used a simple connection to the host ip and port. In another setting, I would not do this approach but for this I thought it was the quickest method with being on free trial and having this temporary thing.

In order for users to register I created a a POST route for users where we can send requests by providing the name, email, and password in the request body. I made these required fields by utilizing sequelize and defining that these are non-null columns when creating the User model and migration. Passwords are also hashed and those hashed passwords to saved to the database utilzing bcrypts. Error handling is caught with a try/catch block and any missing data is returned by sequelize errors.

![Register](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/099f6b09-f3bf-49ad-8377-e7a5ee415681)

I created a new POST route for login where you can send requests by providing an email and password in the body. Users are first found by using the email and sequelize findOne method and then we check if the hashed password matches the password provided by using bcrypts. An error is thrown if email is not found existing to a User or if password does not match. If no error is found then we use jwt to sign user data and send that as the response.

![Login](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/9b2bf0ec-337e-4704-865d-b3b330729177)

To handle creating posts, we first create a new route for posts and a POST method as well. We design a model for Posts in our database where we have one to many relationship (users -> posts). Then we move to GCP and setup a Storage bucket that we will use for this purpose. After creating a service account, applying the neccessary permissions, and creating and downloading a key we can access our new bucket. To upload a photo we make use of Multer and create a middleware with a file size limit. We check if the middleware fails and throw an error if there is no file. Then we create a blob and an upstream and if there are no errors we try to make the file public. If nothing has thrown an error to this point then we create a new Post in the database with the description and new url.

![Create First Post](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/f3cbef1e-abbc-4794-85e8-137d227938e8)
