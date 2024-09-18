
const jwt = require('jsonwebtoken');
const User = require('../models/User')
require('dotenv').config();

// Middleware function to verify JWT token
const verifyToken = async (req, res, next) => {
  const {authorization} = req.headers
  if(!authorization){
    return res.status(401).json({error:'Authorization token required'})
  }

  const token = authorization.split(' ')[1]

  try{
    const {_id} = jwt.verify(token,process.env.accessToken_secret)

    req.user = await User.findOne({_id})
    next()

  }catch(error){
      console.log(error)
      res.status(401).json({error: 'request is not authorized'})
  }
  
};


module.exports = verifyToken;
