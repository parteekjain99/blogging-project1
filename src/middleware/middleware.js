// const authorModel=require('../models/authorModel')
// const blogModel=require('../models/blogModel')
const jwt=require('jsonwebtoken')



const loginCheck=   function(req,res,next){

    let token=req.headers[ 'x-auth-token']
    if(!token){
        return res.status(403).send({status:false,message:"invalid authentication token"})
    }
    let decodedToken =  jwt.verify(token, "functionup-thorium");
    if (!decodedToken) {
      return res.send({ status: false, msg: "token is invalid" });
    }
     if(decodedToken["x-auth-token"] == req.params.blogId){
        next()
     }
     else {
       return res.send({status:false , msg: "not auth"})
     }

    
}

module.exports.loginCheck=loginCheck

