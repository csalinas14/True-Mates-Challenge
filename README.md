# True Mates Challenge

## Requirement 3

### *1.*
To first handle pagination, I created a GET route that is responsible for returning Posts regardless if pagination is included. The route can take query parameters called limit and offset. Limit represents the number of posts we are expecting from a singular page. Offset is the page number we are requesting. We calculate the pageOffset by multiplying these two values which tells us how many posts we should be skipping in our query. Using the sequelize method findAndCountAll allowed us to find the posts we are looking for by passing in limit, pageOffset, and order parameter. It also returns a count of all posts.

Here is the request sent with the query parameters

![get pagination](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/444f6d90-91ef-4b4f-897c-7d7fcae27f70)

And the API results. Note: the first post id starts with three in this database thats why we start with 5 here.

![pagination_query](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/33d19720-b2cf-42e3-96de-3b58931288d1)

### *Errors*
To handle when no query parameters mentioned above are included in the request, it will instead return a different sequelize query that will return all Posts and the total posts count. If one of limit or offset was missing, we included default values that would be passed in the original query. 

Example of one query parameter missing. The default value for a missing offset is zero making this return the first two entries:

![pagination_query_missing](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/2c6f6230-7c93-4813-96b1-fb8821a80757)

Another error that was considered is if the query parameters were not numeric values. This was caught by sequelize with the 'SequelizeDatabaseError' and would return appropriate message. Any other unknown errors were handled with 500 status codes.

![pagination_no_num](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/788172e1-6ca9-4ab2-a355-cc68474c0a3c)

### *2.*
### *Database*
In order for Users to be able to add friends, there were a few things to consider. The first step was to have the database support this new feature. My approach was to create a new table called Friendslist which would be a many to many relationship with Users to Users. Any new friendship added to the table would created two new entries where the userId and friendId were saved as user1 and user2 both ways. User1 and user2 columns had a foreign key relationship with the users table through the user table id. Two more columns were added as well which were called status and requester_id. Status represents if a friendship is the requested state known as 'r' or if its in the accepted state known as 'a'. Requester_id is a foreign key column with the user table's id and represents which of the two users sent the friend request. The purpose of these two columns is to implement a method of friend requests before accepting a friendship between two users. Then a migration was created to represent these changes. In the migration I also added an unique constraint on the user1 and user2 pair so we do not get duplicate entries.

### *EndPoint*
To add friends I created a new route for friendslist and a Post method to create a new friendship. This Post route uses the userExtractor middleware we created to check for Authorization and returns us the user's data, making this only possible for logged in users and throws an error if they are not. The request expects the friend's id in the body which it will use with the user's id to make two different query calls. Using sequelize's findOne method, it will first locate if there is a pending request between the two users. If there are no entries for these two users then we create our first type of response which will create a friend request scenario between the two. This will create the two entries in the database with the 'r' status and setting requester id to the user who sent this request. In the response we send a message showing this happened between the the two users.

Here our user FriendTester who is user 6 is sending a friend request to user Chris who has a user id of 7

![add_friend_request](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/412d9c1d-dde4-45aa-8f2f-a0e59ea982ca)

In the other successful response type, we look to return data when the other user finally accepts the request. We already have the two friendship entries from earlier where this time it was successful in finding the the pair. We  make sure it doesnt trigger any error cases and that the friend's id is matching with the requester_id this time. If these conditions are true then we change the pair of entries status to 'a' for accepted and return a message confirming that the friend request was accepted.

Here Chris now sends his request to the same route and accepts the friend request.

![add_friend_accept](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/bd1a09ef-b388-4b72-bf2e-12831b5702e1)


### *Errors*
A lot of errors can occur through the friend id that is provided. The first is if it even exists it will return an error.

![no_friend_id](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/f202ffee-614b-4f65-a6b6-e438af49d360)

Throws an error if the friend id is matching the user id.

![same_friend](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/f71e78f3-0fe0-4a5d-b258-a8f98b06dec1)

Throws an error if the user already has sent out a friend request by checking if the requester_id is matching the user id and the status is 'r'. The first picture shows the request and the second shows the error.

![request1](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/67c526b6-cc43-4949-b9fe-99375e178e19)
![same_request](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/ed889103-8c56-41f7-b98f-24a3d4bce41c)

Throws an error if the friendship status is already 'a' meaning that these two users are already friends. The picture shows us trying to befriend Chris again.

![already_friends](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/9f3029ae-34be-440a-858c-9ebc6ac60e86)

Another is if we provide a friend id that is numeric but the id is not in the database or we provide an incorrect type for friend id. Some sequelize related errors included if the unique constraint on the pair of values is triggered meaning that we tried to create duplicate values.

![no_friend_id](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/55d0a0ee-02e7-4efd-87a9-4e47ee91be5d)

### *3.*
First we created a new route in the friendslist route that will be a GET request to get the necessary info. This route uses the userExtractor middleware we created to check for Authorization and returns us the user's data, making this only possible for logged in users and throws an error if they are not.  The request works by first calling two queries utilizing sequelize's query method. One query is responsible for returning all the friends of the user and their information by joining the friends id to the user table. We can quickly search through friendslist user1 column looking for the user's id and status equal to accepted. This query will also be important to consider friends who have zero mutual friends because it grabs every one of the user's friends. The second query is responsible for returning the mutual friends count between the user and all their friends. The query creates a sub table where we only include friendships that have been accepted and then inner joins on itself through the friend id including a where clause that passes the user id and to not include duplicate user friendships. This will create rows where the user id is connected to another user who has the same friend id in their friendship where we then group by this user's id and friend id and count the rows. In the case where a friend id has no matches with any other friends this will return no entries and return no count for mutual friends which is why we need the first query. Then we iterate through the results of the query, adding the right mutual_friends to its matching pair and providing a zero if its count does not exist. Not much for errors since we either get results from the query or not but we provided error catching for any unknown errors.

Here we include the friends list of user 3 which includes friends info and varying mutual friends.
![friends_list](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/2bc42dae-aea2-4768-ad4a-2a4d10a0cdf5)

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

## Requirement 1

To build my express app, I used Node and NPM as my package manager to initialize an environment. I installed the necessary dependecies such as express, sequelize, cors, pg, and nodemon for development. In order to create the PostgreSQL database, I had to create an instance through GCP Cloud SQL and configure it for this purpose. I created a seperate database called 'testmates' and a 'tester' user for this purpose as well. Utilizing sequelize I connected to the GCP database for our use. In order to connect and leave the connection open for those who will be testing this, I opened up my authorized networks to everyone and used a simple connection to the host ip and port. In another setting, I would not do this approach but for this I thought it was the quickest method with being on free trial and having this temporary thing.

In order for users to register I created a a POST route for users where we can send requests by providing the name, email, and password in the request body. I made these required fields by utilizing sequelize and defining that these are non-null columns when creating the User model and migration. Passwords are also hashed and those hashed passwords to saved to the database utilzing bcrypts. Error handling is caught with a try/catch block and any missing data is returned by sequelize errors.

![Register](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/099f6b09-f3bf-49ad-8377-e7a5ee415681)

I created a new POST route for login where you can send requests by providing an email and password in the body. Users are first found by using the email and sequelize findOne method and then we check if the hashed password matches the password provided by using bcrypts. An error is thrown if email is not found existing to a User or if password does not match. If no error is found then we use jwt to sign user data and send that as the response.

![Login](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/9b2bf0ec-337e-4704-865d-b3b330729177)

To handle creating posts, we first create a new route for posts and a POST method as well. We design a model for Posts in our database where we have one to many relationship (users -> posts). Then we move to GCP and setup a Storage bucket that we will use for this purpose. After creating a service account, applying the neccessary permissions, and creating and downloading a key we can access our new bucket. To upload a photo we make use of Multer and create a middleware with a file size limit. We check if the middleware fails and throw an error if there is no file. Then we create a blob and an upstream and if there are no errors we try to make the file public. If nothing has thrown an error to this point then we create a new Post in the database with the description and new url.

![Create First Post](https://github.com/csalinas14/True-Mates-Challenge/assets/73559919/f3cbef1e-abbc-4794-85e8-137d227938e8)
