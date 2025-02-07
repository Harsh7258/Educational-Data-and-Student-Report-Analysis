const express = require("express");
const router = express.Router();
const { postSheetAnalysis, getStatistics, getSheetDataTable, getSheetNames, postSheetNames } = require("../controllers/statisticsController");

router.post("/sheet-names", postSheetNames);
router.post("/analyze-sheet", postSheetAnalysis);
router.get("/sheet-rows-data", getSheetDataTable);
router.get("/statistics", getStatistics);
router.get("/sheet-names", getSheetNames);

module.exports = router;


