const mongoose = require('mongoose')
const authorschema= new mongoose.Schema({

     fname: {

        type: String,
        required: true, trim: true
     },

      lname:
      {
          type: String,
          required: true, trim:true
      },

      title:
      {
         type: String,
         required: true,
         enum:['Mr','Mrs','Miss']

      },

      email:
      {
          type: String,
          required:true,
          unique:true,trim:true
      },

      password:
      {
          type:String,
          required:true
      },
      
    
    },
    {timestamps: true})



             module.exports=mongoose.model('myAuthor',authorschema)
