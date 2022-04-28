const express = require('express')
const router = express.Router();
const authorController=require("../controller/authorController")
const blogController= require("../controller/blogController")
const phase2= require("../controller/phase2")
const middleware= require("../middleware/middleware")








router.post('/authors',authorController.createAuthor)

router.post('/blogs',blogController.createBlog)

router.get('/getblogsphase2', blogController.getBlogsphase2)

router.put('/updatedDetails/:blogId', blogController.updateDetails)

router.put('/deletedDetails/:blogId', blogController.deletedById)

router.delete('/blog2', blogController.x)

router.delete('/deletebyquery', blogController.y)

router.post('/login', phase2.loginUser)

router.get('/getblogphase2/:blogId', middleware.loginCheck,  phase2.getblog1)











module.exports=router