const Post = require('./post')
const User = require('./user')
const Photo = require('./photo')

User.hasMany(Post)
Post.belongsTo(User)

Post.hasMany(Photo)
Photo.belongsTo(Post)

module.exports = {
  Post,
  User,
  Photo
}