const blogModel=require("../models/blogModel")
const authorModel=require("../models/authorModel")
const validator=require("../utils/validator");
const { find } = require("../models/authorModel");
const { default: mongoose } = require("mongoose");

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

        const uniqueTagArr =[...new Set(tags)];
        blogData["tags"]=uniqueTagArr;//using array constructor here
    }  
}

if(subcategory){
    if(Array.isArray(subcategory)){

        const uniqueSubcategoryArr=[...new Set(subcategory)];
        blogData["subcategory"]=uniqueSubcategoryArr;//using array constructor here
    }
}
const newBlog= await blogModel.create(blogData)
res.status(201).send({status:true,message:"New blog created successfully",data:newBlog})


}


const getBlogsphase2 = async function (req, res) {
    try {
  
      const check = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }] });
      if (Object.keys(req.query).length === 0) {
        return res.status(200).send({ status: true, data: check });
      }
  
      let search = await blogModel.find({ $or: [{ authorId: req.query.authorId }, { tags: req.query.tag }, { category: req.query.category }, { subcategory: req.query.subcategory }] });
      let result = []
      if (search.length > 0) {
        for (let element of search) {
          if (element.isDeleted == false && element.isPublished == true) {
            result.push(element)
          }
        }
        res.status(200).send({ status: true, data: result });
      } else {
        res.status(404).send({ status: false, message: 'No blogs found of thia author' })
      }
  
    } catch (error) {
      res.status(400).send({ status: false, error: error.message });
    }
  }




// put api logic

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
        
    
    
 const updatedBlog = await blogModel.findOneAndUpdate({_id:req.params.blogId},{

     title: title,
     body : body,
    $addToSet:{tags: tags, subcategory: subcategory}, 
   $set:{isPublished:true}
         
 },
 {new:true}
 )
 
  if(updatedBlog.isPublished==true){
   updatedBlog.isPublishedAt = new Date()
   console.log(updatedBlog)
   return res.status(200).send({status: true, message:"Blog successfully updated", data:updatedBlog})
  }
  if(updatedBlog.isPublished==false){
      updatedBlog.publishedAt=null
  }
  return res.status(200).send({status:true,message:"success",data:updatedBlog})

  }
  else{
      return res.status(400).send({status:false,message:"please provide blog details to update"})
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



// const deletebyquery1 = async function(req,res){
//     let requestBody = req.query
//     const{authorId,category,tags,subcategory}=requestBody;

//     if(!mongoose.isValidObjectId(authorId)){
//          return res.status(404).send({status:false, message:"authorId is Invalid"})
//     }

         
//     if(!validator.isValidString(category)){
//         return res.status(404).send({status:false, message:"category is Invalid"})

//     }

//     if(!validator.isValidString(subcategory)){
//         return res.status(404).send({status:false, message:"subCategory is Invalid"})

//     }

//     if(tags){
//         if(tags.length === 0){
//             return res.status(404).send({status:false, message:"tags is required"})
//         }

//         if(subcategory){
//             if(subcategory.length === 0){
//                 return res.status(404).send({status:false, message:"subcategory is required"})
//             }


//         }

        
//             let data = req.query;
            
        
//             let deletedBlog = await blogModel.updateMany(
//                 { $in: data },
//                 { $set: { isdeleted: true }, deletedAt: Date.now() },
//                 { new: true }
//               )
              
//               if (deletedBlog) {
//                 return res.status(200).send({ status: true, msg: "Document deleted successfully", deletedDoument: deletedBlog })
//               }
//                 else {
//               res.status(400).send({ ERROR: "BAD REQUEST" });
          
//           }     
    
// }
  
// }  



const deletebyParam = async (req, res)=> {    //Arrow allow you to create function in a cleaner way,compared to regular functions.
   
      let data =  req.query
    //   const {authorId, tags, category,subcategory} = data
    //   let blog = await blogModel.findById({authorId})
      let deletedBlog = await blogModel.find({$in : {data}}).updateMany( { $set: { isDeleted: true }, deletedAt: Date.now() },
      { new: true })
          
      res.status(200).send({ message: "successfully updated", data: deletedBlog });
    
    
  }
  


//   const queryParamsDelete = async function (req, res) {
   
//         let conditions ={isPublished:false};
//         let data=req.query;
//         if(data.authorId){
//             conditions.authorId=data.authorId;
//         }
//         if(data.category){
//             conditions.category=data.category;
//         }
//         if(data.tags){
//             conditions.tags=data.tags;
//         }
//         if(data.subcategory){
//             conditions.subcategory=data.subcategory;
//         }
//         if (!conditions) {
//             return res.status(404).send({ status: false, msg: "Query is Mandatory to delete Blog" })
//         }
//         let dataToDelete = await blogModel.find(conditions).updateMany({ $set: { isDeleted: true } }, { new: true });
     
//         if (!dataToDelete) { return res.status(404).send({ status:false})}
           
//           else {  res.send(dataToDelete)}
        
//     }


const blogByQuery = async (req, res) =>{
    try {
      const data = req.query;
  
      if (Object.keys(data) == 0){    
        return res.status(400).send({ status: false, message: "No input provided" });
      }
  
      const { category, subcategory, tags } = data
      
  
      if (category) {
        let verifyCategory = await blogModel.findOne({ category: category })
        if (!verifyCategory) {
          return res.status(400).send({ status: false, msg: 'No blogs in this category exist' })
        }
      }
  
      if (tags) {
        if (typeof(tags)!==[String]) {
          return res.status(400).send({ status: false, msg: 'this is not a valid tag' })
        }
  
        if (!await blogModel.exist(tags)) {
          return res.status(400).send({ status: false, msg: 'no blog with this tags exist' })
        }
      }
  
      if (subcategory) {
        if (typeof(subcategory) !== [String]) {
          return res.status(400).send({ status: false, msg: 'this is not a valid subcategory' })
        }
  
        if (!await blogModel.exist(subcategory)) {
          return res.status(400).send({ status: false, msg: 'no blog with this subcategory exist' })
        }
      }
  
      const deleteByQuery = await blogModel.updateMany(data,{ isdeleted: true, deletedAt: new Date() },
        { new: true }               
      );
      if (!deleteByQuery){
        return res.status(404).send({ status: false, message: "No such blog found" });
      } 
      else{
      res.status(200).send({ status: true, data: deleteByQuery })
      }
  } 
    catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  }; 
      
  

module.exports.createBlog=createBlog
module.exports.getBlogsphase2 = getBlogsphase2
module.exports.updateDetails = updateDetails
module.exports.deletedById = deletedById
// module.exports.x = updateBlog1
// module.exports.queryParamsDelete = queryParamsDelete
module.exports.blogByQuery = blogByQuery
