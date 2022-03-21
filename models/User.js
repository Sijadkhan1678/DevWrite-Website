const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(

   {
      name:   {

           type: String,
           required: true
           
            },

      email: {
           type: String,
           required: true,
           unique: true
       },
     password: {
           type: String,
           required: true,
           unique: true
          


      },
      avatar: {
         type: String
      
      },

      date: {
        type: String,
        default: Date.now


      }
     

    })

module.exports= mongoose.model('user',UserSchema)
