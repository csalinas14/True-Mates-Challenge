const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require("bcrypt")
const { SECRET } = require("../utils/config")

const login = async (req, res) => {
  try{
    const { password, email } = req.body

    if(!password || !email){
      return res.status(400).json({
        error: 'Please provide email and password'
      })
    }
    
    const user = await User.findOne({
      where: {
        email: email
      }
    })

    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password)

    if(!(user && passwordCorrect)){
      res.status(401).json({
        error: 'Invalid email or password'
      })
    }

    const userForToken = {
      name: user.name,
      id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)
    const loginUser = {
      token,
      name: user.name,
      id: user.id
    }
    res.status(200).send(loginUser)
  } catch(error){
    res.status(500).json({error: error.message})
  }
}

module.exports = {
  login
}
