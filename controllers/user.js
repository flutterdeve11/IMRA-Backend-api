const jwt = require('jsonwebtoken');
const  User = require('../models/user');
const Document = require('../models/documents');
const sharp = require('sharp');
const multer = require('multer');
const bcrypt= require('bcrypt');
const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dzq1h0xyu', 
  api_key: '345126432123499', 
  api_secret: 'cqCvcU_hqshoESszVszEnB5-D_8' 
});
//user create  register
exports.createUser = async (req, res)=>{
    const {fullname, email, phonenumber,password,
      date_of_birth,
      country,
      address,
      avatar} = req.body;
    const isNewUser = await User.isThisEmailInUse(email);
    if(!isNewUser)
       return res.json({
        success:false,
        message:'This email is already in use ,try sing-in'
       });
       const user = await User({
        fullname,
        email,
        phonenumber,
        password,
        date_of_birth,
        country,
        address,
        avatar
       });
       await user.save();
       res.json({
        success:true,user
       });
} ;
// 
//for document 
exports.createDocument = async (req, res) => {
  try {
      const { doc_name, description } = req.body;

      // Use the upload middleware here to handle file upload
      upload.single('document')(req, res, async (err) => {
          if (err instanceof multer.MulterError) {
              return res.status(400).json({
                  success: false,
                  message: 'File upload error: ' + err.message,
              });
          } else if (err) {
              return res.status(400).json({
                  success: false,
                  message: 'An error occurred while uploading the file.',
              });
          }

          const documentFile = req.file;

          if (!documentFile) {
              return res.status(400).json({
                  success: false,
                  message: 'Document file is required.',
              });
          }

           newDocument = await Document({
              doc_name,
              description,
              document: documentFile.buffer,
          });

          const savedDocument = await newDocument.save();

          res.status(201).json({
              success: true,
              document: {
                _id: savedDocument._id,
                doc_name: savedDocument.doc_name,
                description: savedDocument.description,
                document:savedDocument.document,
                createdAt: savedDocument.createdAt,
                updatedAt: savedDocument.updatedAt,
            },
          });
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: 'An error occurred while creating the document.',
      });
  }
};
  // user login 
exports.userSignIn = async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user)
      return res.json({
        success: false,
        message: 'user not found, with the given email!',
      });
  
    const isMatch = await user.comparepassword(password);
    if (!isMatch)
      return res.json({
        success: false,
        message: 'email / password does not match!',
      });
    // const superAdmin = user.type === 2;
    // const hospitalAdmin = user.type === 3;
    // const reception = user.type === 4;
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
  
    let oldTokens = user.tokens || [];
  
    if (oldTokens.length) {
      oldTokens = oldTokens.filter(t => {
        const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
        if (timeDiff < 86400) {
          return t;
        }
      });
    }
  
    await User.findByIdAndUpdate(user._id, {
      tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
    });
  
    const userInfo = {
      id:user._id,
      fullname: user.fullname,
      email: user.email,
      phonenumber:user.phonenumber,
      //superAdmin,hospitalAdmin,reception,
      avatar: user.avatar ? user.avatar : '',
    };
  
    res.json({ success: 1, message: 'login successfully', data: userInfo, token });
  };
  
// user logout
  exports.signOut = async (req, res) => {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: 'Authorization fail!' });
      }
  
      const tokens = req.user.tokens;
  
      const newTokens = tokens.filter(t => t.token !== token);
  
      await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
      res.json({ success: true, message: 'Sign out successfully!' });
    }

  };
// user chagne password but not work 
  exports.changePassword = async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
  
    try {
      // Find the user by their ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found with the provided ID.',
        });
      }
  
      // Check if the current password matches the stored password
      const isMatch = await user.comparepassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect.',
        });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      user.password = hashedPassword;
  
      // Save the updated user object to the database
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: 'Password changed successfully.',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while changing the password.',
      });
    }
  };



  //const storage = multer.memoryStorage(); // Store files in memory as buffer
  // const fileFilter = (req, file, cb) => {
  //     if (file.mimetype === 'application/pdf' || file.mimetype === 'image/png') {
  //         cb(null, true); // Accept the file
  //     } else {
  //         cb(new Error('Only PDF or PNG files are allowed.'), false); // Reject the file
  //     }
  // };
  
  // const upload = multer({
  //     storage,
  //     fileFilter,
  // });