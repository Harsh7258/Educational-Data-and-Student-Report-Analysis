const mongoose = require("mongoose");

const perviousData = new mongoose.Schema({
    sheetId: {
        type: String,
        required: true
    },
    sheetName: {
        type: String,
        required: true
    },
    passRate: { 
        type: Number, 
        required: true 
    },
    avgPerformance: { 
        type: Number, 
        required: true 
    },
    attendanceRate: { 
        type: Number, 
        required: true 
    },
    coursePopularity: {
        type: String,
        required: true
    },
    passRateIncrease: {
        type: String
    }, 
    avgPerformanceIncrease: {
        type: String
    },
    attendanceRateIncrease: {
        type: String
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    },
});

const Previous = mongoose.model('Previous', perviousData);
module.exports = Previous;