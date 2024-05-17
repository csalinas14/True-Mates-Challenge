const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require("bcrypt")

const login = async (req, res) => {
  try{
    const { password, email } = req.body
    const user = await User.findOne({
      where: {
        email: email
      }
    })

    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password)

    if(!(user && passwordCorrect)){
      return res.status(401).json({
        error: 'Invalid email or password'
      })
    }

    const userForToken = {
      name: user.name,
      id: user.id
    }

    //better to place secret in .env in actual production
    const token = jwt.sign(userForToken, 'secret')
    const loginUser = {
      token,
      name: user.name,
      id: user.id
    }
    res.status(200).send(loginUser)
  } catch(error){
    res.status(400).json({error: error.message})
  }
}

module.exports = {
  login
}
