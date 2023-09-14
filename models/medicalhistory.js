const mongoose = require("mongoose");

const MedicalHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    procedure: {type: String},
    reason:{type: String},
    medCenter:{type:String},
    //medCenter:{type:mongoose.Schema.Types.ObjectId, ref: "Facility"},
    date: {type: String}
    },
    {timestamps: true}
);


module.exports = mongoose.model("MedicalHistory",MedicalHistorySchema)