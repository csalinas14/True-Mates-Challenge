const router = require('express').Router()
const { userExtractor } = require('../middleware/user')
const { addFriend, getUserFriendsList } = require('../controllers/friendslistController')

router.post("/", userExtractor, addFriend)

router.get("/", userExtractor, getUserFriendsList)

module.exports = router