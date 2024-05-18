const bcrypt = require("bcrypt")
const User = require("../models/user")

const createUser = async (req, res) => {
  try{

    if(!req.body.password){
      return res.status(400).json({error: "Please provide a password!"})
    }
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds)
    const user = await User.create({...req.body, password: passwordHash})
    
    res.json(user)
  } catch (error){

    if(error.name === 'SequelizeValidationError'){
      let errorMsgAry = []
      for(let i=0; i < error.errors.length; i++){
        errorMsgAry.push(error.errors[i].message)
      }
      const errorMsg = errorMsgAry.join(', ')
      return res.status(500).json({error: errorMsg})
    }
    res.status(400).json({error: error.message})
  }
}

module.exports = {
  createUser
}