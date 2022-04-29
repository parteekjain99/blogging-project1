const express = require('express')
const router = express.Router();
const authorController=require("../controller/authorController")
const blogController= require("../controller/blogController")
const phase2= require("../controller/phase2")
const middleware= require("../middleware/middleware")








router.post('/authors',authorController.createAuthor)

router.post('/blogs' , middleware.authentication,blogController.createBlog)

router.get('/getblogsphase2', middleware.authentication , blogController.getBlogsphase2)

router.put('/updatedDetails/:blogId',        middleware.authorization, blogController.updateDetails)

router.delete('/deletedDetails/:blogId' ,   middleware.authorization  ,   blogController.deletedById)

router.delete("/blogdeletebyquery", middleware.authentication, blogController.deleteBlogByQuery);

router.post('/login', phase2.loginUser)

// router.get('/getblogphase2', middleware.authorization ,   phase2.getblog1)











module.exports=router