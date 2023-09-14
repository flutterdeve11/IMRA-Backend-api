
 const  MedicalHistory = require('../models/medicalhistory');
 const  MedicationHistory = require('../models/medicinehistory');
 const User= require('../models/user')

exports.createMedicalHistory = async (req, res) => {
    try {
      // Assuming you have a 'userId' field in the request body to specify the user ID
      const { userId, ...medicalHistoryData } = req.body;
  
      // Check if the user with the provided ID exists
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const medicalHistory = new MedicalHistory({
        ...medicalHistoryData,
        user: user._id, // Set the user reference
      });
  
      await medicalHistory.save();
      res.status(201).json(medicalHistory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  //mdeication history
  exports.createMedicationHistory = async (req, res) => {
    try {
      // Assuming you have a 'userId' field in the request body to specify the user ID
      const { userId, ...medicalHistoryData } = req.body;
  
      // Check if the user with the provided ID exists
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const medicationHistory = new MedicationHistory({
        ...medicalHistoryData,
        user: user._id, // Set the user reference
      });
  
      await medicationHistory.save();
      res.status(201).json(medicationHistory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };