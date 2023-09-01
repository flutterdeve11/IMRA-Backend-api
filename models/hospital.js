const mongoose= require('mongoose');
const bcrypt= require('bcrypt');

const hospitalSchema = new mongoose.Schema({
   fullname: {
       type: String,
       required: true,
     },
     email: {
       type: String,
       required: true,
       unique: true,
     },
     phonenumber:{
       type: String,
       required: true,
     },
     address: {
       type: String,
       required: true,
     },
     branch: {
      type: String,
      required: true,
    },
   
    
});




module.exports= mongoose.model('Hospital',hospitalSchema);