// const authorModel=require('../models/authorModel')
// const blogModel=require('../models/blogModel')
// const jwt=require('jsonwebtoken')



// const loginCheck=   function(req,res,next){

//     let token=req.headers[ 'x-auth-token']
//     if(!token){
//         return res.status(403).send({status:false,message:"invalid authentication token"})
//     }
//     let decodedToken =  jwt.verify(token, "functionup-thorium");
//     if (!decodedToken) {
//       return res.send({ status: false, msg: "token is invalid" });
//     }
//      if(decodedToken["x-auth-token"]!== req.params.blogId){
//         next()
//      }
//      else {
//        return res.send({status:false , msg: "not auth"})
//      }

    
// }

// module.exports.loginCheck=loginCheck




// const authenticate = async function(req,res,next)
// {
//     try 
//     {
//         let token = req.headers["x-auth-token"];
//         if (!token) return res.status(400).send({status: false, msg: "The Request is missing a mandatory header."});
//         let decodedToken = jwt.verify(token,"functionup-thorium");
//         if (!decodedToken) return res.status(401).send({status: false, msg: "Invalid token"});
//         let auth=await authorModel.findById(decodedToken._id);
//         if(auth!=null) next();
//         else return res.status(401).send({status : false,msg : "Author not logged in!"});
//     } 
//     catch(err)
//     {
//         res.status(500).send({status : false,msg: err.message});
//     }
// };

// const authorise = async function(req,res,next)
// {
//     try
//     {
//         let blogId = req.params.blogId
//         let authorId = await blogModel.findOne({_id : blogId},{authorId : 1});
//         let token = req.headers["x-auth-token"]
//         let decodedToken = jwt.verify(token, "functionup-thorium")
//         if(authorId.authorId==decodedToken._id)
//             next();
//         else
//             res.status(403).send({status : false,msg : "Unauthorised Access!"});
//     }
//     catch(err)
//     {
//         res.status(500).send({status : false,msg : err.messsage});
//     }
// };

// module.exports.authenticate = authenticate
// module.exports.authorise = authorise



const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const authorization = function (req,res,next){
    try{
        let token = req.headers['x-auth-token']
        
        if(!token){
            return res.status(400).send({status : false, msg : "neccessary header token is missing"})
        }

        let decodeToken = jwt.verify(token, "functionup-thorium" )
        if(!decodeToken){
            return res.status(400).send({status : false, msg : "this is an invalid token"})
        }

        let authorId = req.body.authorId || req.params.authorId || req.query.authorId
        
        if(!authorId){
            return res.status(400).send({status: false, msg : "AuthorId is required to do this action"})
        }

        if(! mongoose.isValidObjectId(authorId)){
            return res.status(400).send({status: false, msg : "this is not a valid author Id"})
        }

        if(decodeToken.authorId != authorId){
            return res.status(400).send({status: false, msg : "You aren't not authorized to do this"})
        }

        next()
    }

    catch(err){
      return res.status(500).send({status : false, err : err.message})
    }
}

module.exports = {authorization}