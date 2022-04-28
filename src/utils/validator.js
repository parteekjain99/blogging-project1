const mongoose=require('mongoose')

 //we are validating functions


 const isValid=function(value){

    if(typeof value==="undefined"||value===null)
    return false; 
    if(typeof value=="string" &&value.trim().length===0)
    return false;
    return true;
 };

 const isValidTitle=function(title){

    return ["Mr","mrs","Miss"].indexOf(title)!=-1;
 };
 //so,here we are saying that 'undefined'.indexOf() will return 0 as undefined  is found at position 0 in the string undefined
 // however it will return -1 as undefined is not found in the undefine

 const isValidObjectId= function(ObjectId){

    return mongoose.Types.ObjectId.isValid(ObjectId);
 };

 const isValidRequestBody=function(requestBody){
     return Object.keys(requestBody).length>0;
 }

 const isValidString=function(value){
     if(typeof value==="string"&& value.trim().length===0)
     return false;
     return true;
     
 };

 //validating functions ends here.

 module.exports={isValid,isValidTitle,isValidRequestBody,isValidObjectId,isValidString};