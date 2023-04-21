const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



//hashingh password
const saltRounds = 10;
const hashPassword = async(password)=>{
  let salt = await bcrypt.genSalt(saltRounds) // convert normal password to hashed password
  let hashedPassword = await bcrypt.hash(password,salt)
  return hashedPassword
}

//comparing hashed password for login
const hashCompare = async(password,hashedPassword)=>{
return await bcrypt.compare(password,hashedPassword)
}


// token for expiry of details in local storage
const createToken = async (payload)=>{ // can also write as async({name,email,role,id}) instead of object
  let token = await jwt.sign(payload,process.env.secretkey,{expiresIn:'2m'})
  return token
}

const validate = async(req,res,next)=>{
  // console.log(req.headers.authorization)

if(req.headers.authorization){ // token comes here

 let token = req.headers.authorization.split(' ')[1] // takes only token \. it will be "bearer token" so we use [1] to take only token
 let data = await jwt.decode(token) // changes token into payload / only if we use this we can take data.exp

//  console.log(data.exp) // exp is expiry date

 if(Math.floor((+new Date())/1000) <data.exp) {
  ///1000 is for changing ms to seconds // newDate changes to number format
  next(); //' redirects to auth.js which function is next to validate
} else{
    res.status(401).send({message:"Token Expired"})
}
}
  else{
  res.status(400).send({message:" Token Not Found"})
}
}



//role based authentication
const roleAdminGuard = async(req,res,next)=>{
  if(req.headers.authorization){
    let token = req.headers.authorization.split(' ')[1];
    let data = await jwt.decode(token)
    if(data.role === 'admin'){
      next()
    }
    else{
      res.status(402).send({message:'Only admins are allowed'})
    }
  } 
  else{
    res.status(400).send({message:"Token not Found"})
  }
}

module.exports={hashPassword,hashCompare,createToken,validate,roleAdminGuard}