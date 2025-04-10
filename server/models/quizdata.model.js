const mongoose = require("mongoose");

const quizData = new mongoose.Schema({
    sheetId: String,
    sheetName: String,
    stats: [
        {
          quizName: String,
          passRate: Number,
          failRate: Number,
        },
    ],
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

const QuizData = mongoose.model('QuizData', quizData);
module.exports = QuizData;