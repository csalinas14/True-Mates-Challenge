const jwt = require('jsonwebtoken')

const tokenExtractor = (req, res, next) => {
  //console.log(req)
  const authorization = req.get('authorization')
  if(authorization && authorization.startsWith('bearer ')){
    req.token = authorization.replace('bearer ', '')
  }
  next()
}

const userExtractor = (req, res, next) => {
  //console.log(req.token)
  try{
  const decodedToken = jwt.verify(req.token, 'secret')
  if(!decodedToken.id){
    res.status(401).json({ error: 'token invalid'})
  }
  else{
    req.user = decodedToken
  }
} catch(error){
    return res.status(400).send({
      message: 'No token'
    })
}
  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
}