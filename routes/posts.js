const router = require('express').Router()
const { userExtractor } = require('../middleware/user')

const { createPost } = require('../controllers/postController')

router.post("/", userExtractor, createPost)

module.exports = router