const express = require('express')
const bodyParser = require('body-parser')
const { tokenExtractor } = require('./middleware/user')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}))

// parse application/json
app.use(bodyParser.json())

const userRouter = require('./routes/users')
const loginRouter = require('./routes/login')
const postRouter = require('./routes/posts')
const friendslistRouter = require('./routes/friendslist')

app.use(express.json())
app.use(tokenExtractor)

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/posts', postRouter)
app.use('/api/friendslist', friendslistRouter)


module.exports = app