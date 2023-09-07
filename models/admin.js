const mongoose= require('mongoose');
const bcrypt= require('bcrypt');

const adminSchema= new mongoose.Schema({
   fullname: {
       type: String,
       //required: true,
     },
     email: {
       type: String,
      // required: true,
       unique: true,
     },
     phonenumber:{
       type: String,
       //required: true,
     },
     password: {
       type: String,
       //required: true,
     },
     type: {
       type: Number,
      // default: 1, // Default to regular user (1), Admin (2)
       enum: [1,2,3], // 1 for regular user, 2 for admin
       
     },
    
     avatar: {
      type:String
     },
     title:{
      type:String,
      required:true
     },

     addHospital:{
      type: Number, // Representing as a number
      default: 0,   // Default value (0 for false)
      enum: [0, 1],
     },
     manageHospital:{
      type: Number, // Representing as a number
      default: 0,   // Default value (0 for false)
      enum: [0, 1],
    },
    addAdmin:{
      type: Number, // Representing as a number
      default: 0,   // Default value (0 for false)
      enum: [0, 1],
    },
    manageAdmin:{
      type: Number, // Representing as a number
      default: 0,   // Default value (0 for false)
      enum: [0, 1],
    },
    services:{
      type: Number, // Representing as a number
      default: 0,   // Default value (0 for false)
      enum: [0, 1],
    },
     tokens: [{ type: Object }],
    
     
});

adminSchema.pre('save',function(next){
   if(this.isModified('password')){
       bcrypt.hash(this.password,8,(err, hash)=>{
           if(err) return next(err);
           this.password=hash;
           next();
       })
   }
});

adminSchema.methods.comparepassword= async function(password){
   if (!password) throw new Error('Password is mission, can not compare!');
   try {
       const result = await bcrypt.compare(password, this.password);
       return result;
     } catch (error) {
       console.log('Error while comparing password!', error.message);
     }
};

// adminSchema.statics.isThisEmailInUse = async function (email){
//    if (!email) throw new Error('Invalid Email');
//    try {
//      const admin = await this.findOne({ email });
//      if (admin) return false;
 
//      return true;
//    } catch (error) {
//      console.log('error inside isThisEmailInUse method', error.message);
//      return false;
//    }
//};

module.exports= mongoose.model('Admin',adminSchema);