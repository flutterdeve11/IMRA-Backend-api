const express = require('express');
const router = express.Router();
const Hospital = require('../models/hospital');
const multer=  require('multer');
const sharp = require('sharp');
const User= require('../models/user');
const Admin = require('../models/admin');

const {
    createUser,
    createDocument,
    userSignIn,
    
   // uploadProfile,
    signOut,
} = require('../controllers/user');

//for admin controller
const {
  createAdmin,
  adminSignIn,
  createHospitalAdmin,
  createReception,

} = require('../controllers/admin');

const {
  createHospital,
  getHospital

} = require('../controllers/hospital');


const {isAuth}= require('../middlewares/auth');
const {
  validateUserSignUp,
 // validateDoc,
  userVlidation,
  validateUserSignIn,
}= require('../middlewares/validation/user');


const storage = multer.memoryStorage();
//diskStorage({});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb('invalid image file!', false);
    }
  };
const uploads = multer({ storage, fileFilter });
 router.post('/create-user',validateUserSignUp,userVlidation,createUser);
 router.post('/create-superadmin',validateUserSignUp,userVlidation,createAdmin);
 router.post('/create-hospitaladmin',validateUserSignUp,userVlidation,createHospitalAdmin);
 router.post('/create-hospital-recept',validateUserSignUp,userVlidation,createReception);
 router.post('/create-document',createDocument);
 router.post('/sign-in',validateUserSignIn,userVlidation,userSignIn);
 router.post('/sign-in-admin',validateUserSignIn,userVlidation,adminSignIn);
 router.post('/sign-out',isAuth,signOut);
 router.post(
    '/upload-profile',
    isAuth,
    uploads.single('profile'),
    async (req,res)=>{
   const { user }=req;
   if (!user)
   return res
     .status(401)
     .json({ success: false, message: 'unauthorized access!' });
     try {
        const profileBuffer = req.file.buffer;
        //const imageInfo = await sharp(profileBuffer).metadata();
     const {width, height} = await sharp(profileBuffer).metadata();
     const avatar =await sharp(profileBuffer).resize(Math.round(width*0.5),Math.round(height*0.5)).toBuffer()
    
        await User.findByIdAndUpdate(user._id,{avatar});
       res 
       .status(201)
       .json({ success: true, message: 'Your profile has updated!' });
     } catch (error) {
        res
        .status(500)
        .json({ success: false, message: 'server error, try after some time' });
        console.log('error while upload profile image',error.message)
     }
     
    }
   // uploadProfile
  );
  router.post('/create-hospital',createHospital);
  //get api all hospital.
  router.get('/all-hospitals', async (req, res) => {
    try {
      const data = await Hospital.find();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      res.status(500).json({ success: false, message: 'An error occurred.' });
    }
  });
  //get api all user.
  router.get('/all-user', async (req, res) => {
    try {
      const data = await User.find({}, "-password -tokens",);
      
      res.json({ success: true, data});
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ success: false, message: 'An error occurred.' });
    }
  });
   //get api all admin.
   router.get('/all-admin', async (req, res) => {
    try {
      const data = await Admin.find({}, "-password -tokens",);
      
      res.json({ success: true, data});
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ success: false, message: 'An error occurred.' });
    }
  });
//// get all reception api
  router.get('/all-reception', async (req, res) => {
    try {
      const data = await Admin.find({type: 3 }, "-password -tokens",);
      
      res.json({ success: true, data});
    } catch (error) {
      console.error('Error fetching reception:', error);
      res.status(500).json({ success: false, message: 'An error occurred.' });
    }
  });
  // update Reception
  router.patch('/update-reception/:id', async (req, res) => {
    const recptId = req.params.id;
    const updatedData = req.body;
  
    try {
      const updatedReception = await Admin.findByIdAndUpdate(
        recptId,
        updatedData,
        { new: true }
      );
  
      if (!updatedReception) {
        return res.status(404).json({
          success: false,
          message: 'Reception not found.',
        });
      }
  
      res.json({
        success: true,
        message: 'Reception updated successfully.',
        data: updatedReception,
      });
    } catch (error) {
      console.error('Error updating Reception:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while updating the Reception.',
      });
    }
  });

//Delete reception
router.delete('/delete-reception/:id', async (req, res) => {
  const recptId = req.params.id;

  try {
    const deletedReception = await Admin.findByIdAndDelete(recptId);
    if (!deletedReception) {
      return res.status(404).json({
        success: false,
        message: 'Reception not found.',
      });
    }
    res.json({
      success: true,
      message: 'Reception deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting Reception:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the Reception.',
    });
  }
});


///Delete api hospital
  router.delete('/delete-hospital/:id', async (req, res) => {
    const hospitalId = req.params.id;
  
    try {
      const deletedHospital = await Hospital.findByIdAndDelete(hospitalId);
      if (!deletedHospital) {
        return res.status(404).json({
          success: false,
          message: 'Hospital not found.',
        });
      }
      res.json({
        success: true,
        message: 'Hospital deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting hospital:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the hospital.',
      });
    }
  });

  //Update api hospital 
  router.patch('/update-hospital/:id', async (req, res) => {
    const hospitalId = req.params.id;
    const updatedData = req.body;
  
    try {
      const updatedHospital = await Hospital.findByIdAndUpdate(
        hospitalId,
        updatedData,
        { new: true }
      );
  
      if (!updatedHospital) {
        return res.status(404).json({
          success: false,
          message: 'Hospital not found.',
        });
      }
  
      res.json({
        success: true,
        message: 'Hospital updated successfully.',
        data: updatedHospital,
      });
    } catch (error) {
      console.error('Error updating hospital:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while updating the hospital.',
      });
    }
  });


  // delete api for user
  router.delete('/delete-user/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }
      res.json({
        success: true,
        message: 'User deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting User:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the User.',
      });
    }
  });

  //update user api
  router.patch('/update-user/:id', async (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updatedData,
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }
  
      res.json({
        success: true,
        message: 'User updated successfully.',
        data: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while updating the user.',
      });
    }
  });
  
// reset password
// Reset password using token
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    // Find the user by email and check if the token is valid and not expired
    const user = await User.findOne({
      email,
      resetToken: token,
      resetTokenExpiration: { $gt: 1 }
    });

    if (!user) {
      return res.json({ success: false, message: 'Invalid or expired token.' });
    }

    // Update the user's password and clear the reset token
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'An error occurred.' });
  }
});
  
  module.exports = router;