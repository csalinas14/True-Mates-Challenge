const router = require('express').Router()
const { userExtractor } = require('../middleware/user')
const { createPost, getPost, changePost, getPaginationPosts } = require('../controllers/postController')

router.post("/", userExtractor, createPost)

router.get("/:id", getPost)

router.put("/:id", userExtractor, changePost)

router.get("/", getPaginationPosts)

module.exports = router
