const express = require("express");
const router = express.Router();
const { postSheetAnalysis, 
    getStatistics, 
    getSheetDataTable, 
    getSheetNames, 
    postSheetNames, 
    getCourseStatistics, 
    getQuizStatistics,
    getAveragePerformance
} = require("../controllers/statisticsController");

router.route("/analyze-sheet").post(postSheetAnalysis).get(getStatistics);
router.route("/sheet-names").post(postSheetNames).get(getSheetNames);
router.get("/sheet-rows-data", getSheetDataTable);
router.get("/course-statistics", getCourseStatistics);
router.get("/quiz-data", getQuizStatistics);
router.get("/average-performance", getAveragePerformance);

module.exports = router;


