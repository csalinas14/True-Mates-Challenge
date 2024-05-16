const router = require('express').Router()
const { userExtractor } = require('../middleware/user')
const { createPost, getPost, changePost } = require('../controllers/postController')

router.post("/", userExtractor, createPost)

router.get("/:id", getPost)

router.put("/:id", changePost)

module.exports = router