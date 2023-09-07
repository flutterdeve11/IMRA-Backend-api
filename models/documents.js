const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doc_name: {type: String, 
        // required: true,
        
        },
    description: {type: String, 
         //required: true, 
        },
    document: {
        type: String,
        //required: true,
        // validate: {
        //     validator: function (value) {
        //         return value && (value.mimetype === 'application/pdf' || value.mimetype === 'image/png');
        //     },
        //     message: 'Only PDF or PNG files are allowed.'
        // }
    }
},{timestamps: true})

module.exports = mongoose.model("Document", documentSchema);