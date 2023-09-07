const  Document = require('../models/documents');
const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dzq1h0xyu', 
  api_key: '345126432123499', 
  api_secret: 'cqCvcU_hqshoESszVszEnB5-D_8' ,
  resource_type: 'auto' 
});

exports.createDocument = async (req, res) => {
    const { doc_name, description, document,} = req.body;
    //const isNewAdmin = await Admin.isThisEmailInUse(email);
    // if (!isNewAdmin)
    //     return res.json({
    //         success: false,
    //         message: "This email is already in use ,try sing-in",
    //     });
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
  }
    const result = await cloudinary.uploader.upload(req.file.path,{
        resource_type: 'auto', 
    });
    console.log(result)
   
    const doc = await Document({
        doc_name,
        description, 
        document: result.secure_url
    });
    await doc.save();
    res.json({
        success: true,
        doc,
    });
  };