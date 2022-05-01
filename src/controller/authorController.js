const authorModel=require("../models/authorModel")
 const validator=require("../utils/validator")

 const createAuthor= async function (req,res){
    
  try { let requestBody=req.body




     if(!validator.isValidRequestBody(requestBody)){
         return res.status(400).send({status:false,message:"invalid request parameter,provide author Details"});
     }



//extracting form params

const{fname,lname,title,email,password}=requestBody;

//validation start & detecting here  false value.
if(!validator.isValid(fname)){
    return res.status(400).send({status:false,message:"First name is required"});

}

if (!validator. isValid(lname)){
    return res.status(400).send({status:false,message:"Last name is required"})
}

if (!validator. isValid(title)){
    return res.status(400).send({status:false,message:"title  is required"})
}
if (!validator. isValid(title)){
    return res.status(400).send({status:false,message:"Title should be Mr,Mrs,Miss"})
}


if (!validator. isValid(email)){
    return res.status(400).send({status:false,message:"email name is required"})
}
if (!validator. isValid(password)){
    return res.status(400).send({status:false,message:"Password is required"})
}
const isEmailAlreadyUsed=await authorModel.findOne({email});

if(isEmailAlreadyUsed){


    return res.status(400).send({status:false,message:`{email} email address is already registered`});

}

//validation ends


const createNewAuthor= await authorModel.create(requestBody)
      res.send({message:'Author successfully created',data:createNewAuthor});

}catch (error) {
    res.status(400).send({ status: false, error: error.message });
  }
}
module.exports.createAuthor=createAuthor
