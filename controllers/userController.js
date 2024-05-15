//const { sendServerError, sendOkResponse } = require("../../core/responses")
const bcrypt = require("bcrypt")
const User = require("../models/user")

const createUser = async (req, res) => {
  try{

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds)
    const user = await User.create({...req.body, password: passwordHash})
    
    res.json(user)
  } catch (error){
    
    res.status(400).json({error: error.message})
  }
}

module.exports = {
  createUser
}