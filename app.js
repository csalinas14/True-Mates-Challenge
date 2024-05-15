const express = require('express')
const { tokenExtractor } = require('./middleware/user')
const app = express()

const userRouter = require('./routes/users')
const loginRouter = require('./routes/login')
const postRouter = require('./routes/posts')

app.use(express.json())
app.use(tokenExtractor)

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/posts', postRouter)


module.exports = app