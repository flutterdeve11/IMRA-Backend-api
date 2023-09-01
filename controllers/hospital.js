const Hospital = require('../models/hospital');

exports.createHospital = async (req, res)=>{
    const {fullname, email, phonenumber,address,branch} = req.body;
       const hospital = await Hospital({
        fullname,
        email,
        phonenumber,
        address, 
        branch
       });
       await hospital .save();
       res.json({
        success:true,hospital
       });
} ;


// exports.getHospital = async(res,req)=>{
//     try {
//         const hospitals = await Hospital.find();
//         res.json({ success: true, hospitals });
//       } catch (error) {
//         console.error('Error fetching hospitals:', error);
//         res.status(500).json({ success: false, message: 'An error occurred.' });
//       }
// }