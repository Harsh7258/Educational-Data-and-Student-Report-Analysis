const mongoose = require("mongoose");

const sheetIdAndName = new mongoose.Schema({
    sheetId: {
        type: String,
        required: true,
        unique: true
    },
    sheetName: {
        type: [String],
        required: true
    },
    createdAt: {
        type: Date, 
        default: Date.now
    }
});

const SheetIDandName = mongoose.model('SheetData', sheetIdAndName);
module.exports = SheetIDandName;