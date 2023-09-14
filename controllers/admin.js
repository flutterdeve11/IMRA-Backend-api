const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
// const {cloudinary} = require('../middlewares/clouddary')

const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dzq1h0xyu', 
  api_key: '345126432123499', 
  api_secret: 'cqCvcU_hqshoESszVszEnB5-D_8' 
});

// for super admin
exports.createAdmin = async (req, res) => {
  const { fullname, email, phonenumber, password, type, title } = req.body;
  //const isNewAdmin = await Admin.isThisEmailInUse(email);
  // if (!isNewAdmin)
  //     return res.json({
  //         success: false,
  //         message: "This email is already in use ,try sing-in",
  //     });
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
}
  const result = await cloudinary.uploader.upload(req.file.path);
  // console.log(result)
  
  const admin = await Admin({
      fullname,
      email,
      phonenumber,
      password,
      type,
      title,
      avatar: result.secure_url
  });
  await admin.save();
  res.json({
      success: true,
      admin,
  });
};



  //for hospital admin
  exports.createHospitalAdmin = async (req, res)=>{
    const {fullname, email, phonenumber,password, type} = req.body;
    const isNewAdmin = await Admin.isThisEmailInUse(email);
    if(!isNewAdmin)
       return res.json({
        success:false,
        message:'This email is already in use ,try sing-in'
       });
       const admin = await Admin({
        fullname,
        email,
        phonenumber,
        password,
        type,
       });
       await admin .save();
       res.json({
        success:true,admin
       });
  } ;
  // hospital reception

  exports.createReception = async (req, res)=>{
    const {fullname, email, phonenumber,password, type} = req.body;
    const isNewAdmin = await Admin.isThisEmailInUse(email);
    if(!isNewAdmin)
       return res.json({
        success:false,
        message:'This email is already in use ,try sing-in'
       });
       const admin = await Admin({
        fullname,
        email,
        phonenumber,
        password,
        type,
       });
       await admin .save();
       res.json({
        success:true,admin
       });
  } ;

  //for login
  exports.adminSignIn = async (req, res) => {
    const { email, password } = req.body;
  
    const admin = await Admin.findOne({ email });
  
    if (!admin)
      return res.json({
        success: false,
        message: 'admin not found, with the given email!',
      });
  
    // const isMatch = await admin.comparepassword(password);
    // if (!isMatch)
    //   return res.json({
    //     success: false,
    //     message: 'email / password does not match!',
    //   });
    const superAdmin = admin.type === 1;
    const hospitalAdmin = admin.type === 2;
    const reception = admin.type === 3;
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
  
    let oldTokens = admin.tokens || [];
  
    if (oldTokens.length) {
      oldTokens = oldTokens.filter(t => {
        const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
        if (timeDiff < 86400) {
          return t;
        }
      });
    }
  
    await Admin.findByIdAndUpdate(admin._id, {
      tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
    });
  
    const adminInfo = {
      id:admin._id,
      fullname: admin.fullname,
      email: admin.email,
      phonenumber:admin.phonenumber,
      superAdmin,hospitalAdmin,reception,
      avatar: admin.avatar ? admin.avatar : '',
    };
  
    res.json({ success: 1, message: 'login successfully', data: adminInfo, token });
  };
  //const Admin = require('../models/Admin');

  // Controller method to toggle admin's is_active status
  exports.toggleActiveStatus = async (req, res) => {
    const { adminId } = req.params;
    try {
        const inactive_admin = await Admin.findById(adminId);
        console.log(inactive_admin)
        if (!inactive_admin) {
            return res.status(404).json({ message: "there is no admin found" });
        }
        inactive_admin.is_active = !inactive_admin.is_active;
        await inactive_admin.save();
        res.status(200).json(inactive_admin);
    } catch (error) {
        res.status(500).json({
            message: "An error occured ",
            error: error.message,
        });
    }
}
  
  



  
  
  
  
  

