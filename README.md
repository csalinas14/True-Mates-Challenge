# True Mates Challenge

## Requirement 3

1. To first handle pagination, I created a GET route that is responsible for returning Posts regardless if pagination is included. The route can take query parameters called limit and offset. Limit represents the number of posts we are expecting from a singular page. Offset is the page number we are requesting. We calculate the pageOffset by multiplying these two values which tells us how many posts we should be skipping in our query. Using the sequelize method findAndCountAll allowed us to find the posts we are looking for by passing in limit and pageOffset and also returns a count of all posts.

### *Errors*
To handle when no query parameters mentioned above are included in the request, it will instead return a different sequelize query that will return all Posts and the total posts count. If one of limit or offset was missing, we included default values that would be passed in the original query. 


Another error that was considered is if the query parameters were not numeric values. This was caught by sequelize with the 'SequelizeDatabaseError' and would return appropriate message. Any other unknown errors were handled with 500 status codes.

2. 
### *Database*
In order for Users to be able to add friends, there were a few things to consider. The first step was to have the database support this new feature. My approach was to create a new table called Friendslist which would be a many to many relationship with Users to Users. Any new friendship added to the table would created two new entries where the userId and friendId were saved as user1 and user2 both ways. User1 and user2 columns had a foreign key relationship with the users table through the user table id. Two more columns were added as well which were called status and requester_id. Status represents if a friendship is the requested state known as 'r' or if its in the accepted state known as 'a'. Requester_id is a foreign key column with the user table's id and represents which of the two users sent the friend request. The purpose of these two columns is to implement a method of friend requests before accepting a friendship between two users. Then a migration was created to represent these changes. In the migration I also added an unique constraint on the user1 and user2 pair so we do not get duplicate entries.

### *EndPoint*
To add friends I created a new route for friendslist and a Post method to create a new friendship. This Post route uses the userExtractor middleware we created to check for Authorization and returns us the user's data, making this only possible for logged in users and throws an error if they are not. The request expects the friend's id in the body which it will use with the user's id to make two different query calls. Using sequelize's findOne method, it will first locate if there is a pending request between the two users. If there no entries for these two users then we create our first type of response which will create a friend request scenario between the two. This will create the two entries in the database with the 'r' status and setting requesterId to the user who sent this request. In the response we send a message showing this happened between the the two users.

In the other successful response type, we look to return data when the other user finally accepts the request. We already have the two friendship entries from earlier where this time it was successful in finding the the pair. We  make sure it doesnt trigger any error cases and that the friend's id is matching with the requester_id this time. If these conditions are true then we change the pair of entries status to 'a' for accepted and return a message confirming that the friend request was accepted.

### *Errors*
A lot of errors can occur through the friend id that is provided. The first is if it even exists it will return an error.

Throws an error if the friend id is matching the user id.

Throws an error if the user already has sent out a friend request by checking if the requester_id is matching the user id and the status is 'r'.

Throws an error if the friendship status is already 'a' meaning that these two users are already friends.

Some sequelize related errors included if the unique constraint on the pair of values is triggered meaning that we tried to create duplicate values.

Another is if we provide a friend Id that is numeric but the id is not in the database or we provide an incorrect type for friend id.

3. First we created a new route in the friendslist route that will be a GET request to get the necessary info. This route uses the userExtractor middleware we created to check for Authorization and returns us the user's data, making this only possible for logged in users and throws an error if they are not.  The request works by first calling two queries utilizing sequelize's query method. One query is responsible for returning all the friends of the user and their information by joining the friends id to the user table. This query will also be important to consider friends who have zero mutual friends. The second query is responsible for returning the mutual friends count between the user and all their friends. The query creates a sub table where we only include friendships that have been accepted and then joins on itself through the friend id. In the case where a friend id has no matches with any other friends this will return no entries and return no count for mutual friends. Then we iterate through the results of the query, adding the right mutual_friends to its matching pair and providing a zero if its count does not exist. Not much for errors since we either get results from the query or not but we provided error catching for any unknown errors.



## Requirement 2

1. In order to add an attribute to posts when created I first had to change the Post model to include an attribute column with string type. Then I created a new migration that adds the attribute column to the posts table.  I included attribute as part of the response body for the post creation request with error handling if not included. In order to consider prior posts to this change, I added a default value for those rows.

2. The first step was to create a new get request for the post router that will return a post by id. I handled errors if the post is not found with the id and if the id is not the right type. I had already included timestamps when creating Posts by utilzing sequelize and found the time difference in milliseconds by utilzing Date object. I found the conversions for all the different types of times and used conditionals to determine which one would be the most appropiate.

3. To start out, I had to reconsider my database setup because I had the photo url as a column in Post table. To incorporate more photos I thought it would be best to create a new table for photos where they would have a one to many relationship with posts, through postId. When the new table was set I had to alter the post creation request. To consider files with the same name I decided to add a pre-tag to the filename with something like 'user-1' to represent a user with id 1 which made every url unique.  I had to adjust multer to account for multiple files and looped through each file to create a writing stream for each one. I grouped each writing stream into an array of promises and waited for all of them to execute. Part of this process included creating a new Photo in the table with the necessary url and postId. The new Post now does not include information in the photo column and I changed the column to include nulls as part of the migration. We will keep the column until we transfer data from previous posts to the new Photo table. Posts did not require photos and posts without photos do not create any entries in the photos table. Lastly, we accounted for errors like too many files being passed with multer.

4. Created a new route and controller for modifying a post. With a PUT request, we passed a necessary description to the body and a post id to params. We check for errors by making sure there is a description, the id finds a Post, or the id is the incorrect type.

## Requirement 1

To build my express app, I used Node and NPM as my package manager to initialize an environment. I installed the necessary dependecies such as express, sequelize, cors, pg, and nodemon for development. In order to create the PostgreSQL database, I had to create an instance through GCP Cloud SQL and configure it for this purpose. I created a seperate database called 'testmates' and a 'tester' user for this purpose as well. Utilizing sequelize I connected to the GCP database for our use. In order to connect and leave the connection open for those who will be testing this, I opened up my authorized networks to everyone and used a simple connection to the host ip and port. In another setting, I would not do this approach but for this I thought it was the quickest method with being on free trial and having this temporary thing.

In order for users to register I created a a POST route for users where we can send requests by providing the name, email, and password in the request body. I made these required fields by utilizing sequelize and defining that these are non-null columns when creating the User model and migration. Passwords are also hashed and those hashed passwords to saved to the database utilzing bcrypts. Error handling is caught with a try/catch block and any missing data is returned by sequelize errors.

![Register](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/099f6b09-f3bf-49ad-8377-e7a5ee415681)

I created a new POST route for login where you can send requests by providing an email and password in the body. Users are first found by using the email and sequelize findOne method and then we check if the hashed password matches the password provided by using bcrypts. An error is thrown if email is not found existing to a User or if password does not match. If no error is found then we use jwt to sign user data and send that as the response.

![Login](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/9b2bf0ec-337e-4704-865d-b3b330729177)

To handle creating posts, we first create a new route for posts and a POST method as well. We design a model for Posts in our database where we have one to many relationship (users -> posts). Then we move to GCP and setup a Storage bucket that we will use for this purpose. After creating a service account, applying the neccessary permissions, and creating and downloading a key we can access our new bucket. To upload a photo we make use of Multer and create a middleware with a file size limit. We check if the middleware fails and throw an error if there is no file. Then we create a blob and an upstream and if there are no errors we try to make the file public. If nothing has thrown an error to this point then we create a new Post in the database with the description and new url.

![Create First Post](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/f3cbef1e-abbc-4794-85e8-137d227938e8)
