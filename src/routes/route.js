const express = require('express')
const router = express.Router();
const authorController=require("../controller/authorController")
const blogController= require("../controller/blogController")

router.post('/authors',authorController.createAuthor)
router.post('/blogs',blogController.createBlog)
router.get('/getblogs', blogController.getBlog)
router.put('/updatedDetails/:blogId', blogController.updateDetails)
router.put('/deletedDetails/:blogId', blogController.deletedById)
router.delete('/blog2', blogController.x)









module.exports=router