const Post = require('./post')
const User = require('./user')
const Photo = require('./photo')
const FriendsList = require('./friendslist')

User.hasMany(Post)
Post.belongsTo(User)

Post.hasMany(Photo)
Photo.belongsTo(Post)

User.belongsToMany(User, { through: FriendsList, as: 'first_friend'})
User.belongsToMany(User, { through: FriendsList, as: 'second_friend'})

module.exports = {
  Post,
  User,
  Photo
}