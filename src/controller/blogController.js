const blogModel=require("../models/blogModel")
const authorModel=require("../models/authorModel")
const validator=require("../utils/validator");
const { find } = require("../models/authorModel");

//creating blog by author id
const createBlog=async function(req,res){

const requestBody=req.body;
if(!validator.isValidRequestBody(requestBody)){
    return res.status(400).send({status:false,message:"invalid request parameters,please provide blog details"})
}

//extracting from params
const{title,body,authorId,tags,category,subcategory, isPublished}=requestBody

//validation starts
if(!validator.isValid(title)){
    return res.status(400).send({status:false,message:"Blog Title is required"})
}

if(!validator.isValid(body)){
    return res.status(400).send({status:false,message:"Blog body is required"})
}

if(!validator.isValid(authorId)){
    return res.status(400).send({status:false,message:"Author id is required"})
}

if(!validator.isValid(authorId)){
    return res.status(400).send({status:false,message:`${authorId}is not a valid author id`})
}

const findAuthor=await authorModel.findById(authorId)
if(!findAuthor){
    return res.status(400).send({status:false,message:"Author doesnot exist"})
}

if(!validator.isValid(category)){
    return res.status(400).send({status:false,message:"Blog Title is required"})
}
//validation ends
const blogData={
    title,body,authorId,category, isPublished:isPublished?isPublished:false,
    publishedAt:isPublished ?new Date():null,
}


if(tags){
    if(Array.isArray(tags)){

        const uniqueTagArr=[...new Set(tags)];
        blogData["tags"]=uniqueTagArr;//using array constructor here
    }
}

if(subcategory){
    if(Array.isArray(subcategory)){

        const uniqueSubcategoryArr=[...new Set(subcategory)];
        blogData["tags"]=uniqueSubcategoryArr;//using array constructor here
    }
}
const newBlog= await blogModel.create(blogData)
res.status(201).send({status:true,message:"New blog created successfully",data:newBlog})


}


const getBlog = async function(req,res){
    let x = {
        isDeleted:false,
        deletedAt :null,
       isPublished:true
    }
    
    let queryParam = req.query
    const {authorId,tags,category,subcategory}= queryParam
    
    if(!validator.isValidString(authorId)){
        return res.status(400).send({status:false,message:"Author id is required"})

    }

    if(authorId){
        if(!validator.isValid(authorId)){
            return res.status(400).send({status:false,message:"Author id not valid"})
    
        }
    }

    if(!validator.isValidString(tags)){
        return res.status(400).send({status:false,message:"tags id is required"})

    }

    if(!validator.isValidString(category)){
        return res.status(400).send({status:false,message:"category id is required"})

    }

    if(!validator.isValidString(subcategory)) {
        return res.status(400).send({status:false,message:"subcatagory id is required"})

    }

    const result = await blogModel.find(x)
    res.send(result)
}

const updateDetails = async function(req,res){
    let blogId=req.params.blogId;
    let requestBody=req.body;
    
    const{title,body,tags,subcategory}=requestBody;

    if(!validator.isValidObjectId(blogId)){
         return res.status(404).send({status:false, message:"blogId is Invalid"})
    }

         
    if(!validator.isValidString(body)){
        return res.status(404).send({status:false, message:"body is Invalid"})

    }

    if(!validator.isValidString(title)){
        return res.status(404).send({status:false, message:"title is Invalid"})

    }

    if(tags){
        if(tags.length === 0){
            return res.status(404).send({status:false, message:"tags is required"})
        }

        if(subcategory){
            if(subcategory.length === 0){
                return res.status(404).send({status:false, message:"subcategory is required"})
            }
        }
    }
    let blog = await blogModel.findOne({_id:blogId})
    if(!blog){
        return res.status(404).send({status:false, message:"No such blog found"})
    }
    if(req.body.title || req.body.body || req.body.tags || req.body.subcategory ){
        const title = req.body.title
        const body = req.body.body
        const tags = req.body.tags
        const subcategory = req.body.subcategory
        const isPublished = req.body.isPublished
    }

 const updatedBlog = await blogModel.findOneAndUpdate({_id:req.params.blogId},{

     title: title,
     body : body,
    $addToSet:{tags: tags, subcategory: subcategory}, 
   $set:{isPublished:true}
         
 },
 {new:true}
 )
 
  if(updatedBlog.isPublished=true){
   updatedBlog.isPublishedAt = new Date()
   console.log(updatedBlog)
   res.status(200).send({status: true, message:"Blog successfully updated", data:updatedBlog})
  }

}

const deletedById = async function(req,res){
    let data = req.params.blogId
    if(!validator.isValidObjectId(data)){
        res.status(400).send({status:false ,  msg:"invalid blogId"})
    }
    let blogid = await blogModel.findOne({_id:data})
    if(!blogid) {
        return res.status(400).send({ status:false , msg:"not found blogId" })
    }
    let blogexist =  await blogModel.exists({_id:data})
    if(blogexist) {  return res.send({status:true , msg:"successfully deleted"})}

      else{ res.send({status:false , msg:"already deleted"})}
       
      let Update=await blogModel.findOneAndUpdate({_id:data},{isDeleted:true,deletedAt:Date()},{new:true})
    if(Update){ res.status(200).send({status:true,data:Update,message:"successfully deleted blog "})}

else res.status(404).send({status:false,msg:"Blog already deleted"})

}


// const blogByQuery = async function(req,res){
//     try{
//         const { category, 
//             authorId, 
//             tags, 
//             subcategory, 
//             isPublished} = req.query

//         const blog =  await blogModel.find({$or: [{category : category}, {author : authorId}, {tags : tags}, {subcategory: subcategory}, {isPublished : isPublished} ]}).updateMany({isDeleted : true}, {new : true})

//         if(blog){
//           return  res.status(200).send({status : true, msg : "Document deleted successfully", deletedDoument : blog})
//         } else{
//            return res.status(400).send({status : false, msg : "Could not find any document related to your query"})
//         }
//     }
//     catch(err){
//         res.status(500).send({status : false, msg : err.message })
//     } 
// }

const deleteBlogByQuery= async function(req,res){
    let data = req.params
    if(!validator.isValidObjectId(data)){
        res.status(400).send({status:false ,  msg:"invalid blogId"})
    }
    let blogid = await blogModel.findOne({_id:data})
    if(!blogid) {
        return res.status(400).send({ status:false , msg:"not found blogId" })
    }
    let blogexist =  await blogModel.exists({_id:data})
    if(blogexist) {  return res.send({status:true , msg:"successfully deleted"})}

      else{ res.send({status:false , msg:"already deleted"})}
       
      let Update=await blogModel.findOneAndUpdate({_id:data},{isDeleted:true,deletedAt:Date()},{new:true})
    if(Update){ res.status(200).send({status:true,data:Update,message:"successfully deleted blog "})}

else res.status(404).send({status:false,msg:"Blog already deleted"})

}
 const x = async function (req,res){
 
        try{
            const { category, 
                authorId, 
                tags, 
                subcategory, 
                isPublished} = req.query
    
            const blog =  await blogModel.find({$or: [{category : category}, {author : authorId}, {tags : tags}, {subcategory: subcategory}, {isPublished : isPublished} ]}).updateMany({isDeleted : true}, {new : true})
    
            if(blog){
                  res.status(200).send({status : true, msg : "Document deleted successfully", deletedDoument : blog})
            } else{
                res.status(400).send({status : false, msg : "Could not find any document related to your query"})
            }
        }
        catch(err){
            res.status(500).send({status : false, msg : err.message })
        } 
    
    
    }
   








module.exports.createBlog=createBlog
module.exports.getBlog =getBlog 
module.exports.updateDetails = updateDetails
module.exports.deletedById = deletedById
module.exports.deleteblogByQuery=deleteBlogByQuery
