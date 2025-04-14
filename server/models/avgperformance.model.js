const mongoose = require("mongoose");

const avgPerformanceDataArray = new mongoose.Schema({
    quizName: { 
        type: String, 
        required: true, 
    },
    normalizedQuizName : {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    avgPerformance: { 
        type: Number, 
        default: 0 
    },
    previousAvgPerformance: { 
        type: Number, 
        default: 0 
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
})

const avgPerformanceData = new mongoose.Schema({
    sheetId: {
      type: String,
      required: true,
    },
    sheetName: {
      type: String,
      required: true,
    },
    data: {
      type: [avgPerformanceDataArray], 
      default: [],
    },
  });

const AvgPerformanceData = mongoose.model('AvgPerformance', avgPerformanceData);
module.exports =  AvgPerformanceData;