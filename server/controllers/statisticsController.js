const { google } = require("googleapis")
const cron = require("node-cron");
const { formatSheetData, calculateMetrics, calcPercentageIncrease } = require("./sheet-analysis");
const Previous = require("../models/pervious.model");
const SheetIDandName = require("../models/sheet.model");

const API_KEY = process.env.API_KEY;
const sheets = google.sheets({ 
  version: "v4",
  auth: API_KEY 
});

// @desc    Sheet titles in a []
// @route   POST /api/educational-data-sheet/sheet-names
// @access  Public
const postSheetNames = async(req, res) =>{
  try {
    const { sheetId } = req.body;
    if(!sheetId) {
      return res.status(400).json({ error: "Sheet ID is required." });
    }

    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
      key: API_KEY
    });

    const latestSheetNames = response.data.sheets.map(sheet => sheet.properties.title);
    if (latestSheetNames.length === 0) {
      return res.status(400).json({ error: "No sheets found in the provided Google Sheet." });
    }

    let sheetEntry = await SheetIDandName.findOne({ sheetId });
    if(!sheetEntry){
      console.log(`Saving new sheet ID: ${sheetId}`);
      // console.log(response.data.sheets);
    
      sheetEntry = new SheetIDandName({ sheetId, sheetName: latestSheetNames });
      await sheetEntry.save();
    } else {
      const existingSheetNames = sheetEntry.sheetName || [];
      const newSheetsAdded = latestSheetNames.filter(name => !existingSheetNames.includes(name));

      if (newSheetsAdded.length > 0) {
        sheetEntry.sheetName = latestSheetNames;  
        await sheetEntry.save();
        console.log(`Updated sheet names for ${sheetId}: ${latestSheetNames}`);
      } else {
        console.log(`No new sheets found for ${sheetId}.`);
      }
    }

    return res.status(200).json({
      status: "success",
      sheetName: sheetEntry.sheetName,
      message: "Sheet retrieved from database"
    });

  } catch (error) {
    console.error("Error saving sheet ID:", error.message);
    res.status(500).json({ 
      error: "Failed to save sheet ID." 
    });
  }
}

// @desc    Sheet adata analysis (big data analytics)
// @route   POST /api/educational-data-sheet/analyze-sheet
// @access  Public
const postSheetAnalysis = async (req, res) => {
  const { sheetId, sheetName } = req.body;
  // console.log(sheetId, sheetName);
  if (!sheetId || !sheetName) {
    return res.status(400).json({ error: "Sheet ID and Sheet Name are required" });
  }
  
    try {
      const { passRate, avgPerformance, attendanceRate, mostUsedCourse } =
        await calculateMetrics(sheetId, sheetName);

        let existingSheet = await SheetIDandName.findOne({ sheetId, sheetName });
        if (!existingSheet) {
            try {
                existingSheet = new SheetIDandName({ sheetId, sheetName });
                await existingSheet.save();
                console.log(`Successfully saved sheet details for ${sheetName} (${sheetId}) to the database.`);
            } catch (error) {
                console.error(`Error saving sheet details for ${sheetName} (${sheetId}):`, error.message || error);
            }
        } else {
            console.log(`Sheet already exists: ${sheetName} (${sheetId})`);
        }

      let previousData = await Previous.findOne({ sheetId, sheetName });
  
      if (!previousData) {
        previousData = new Previous({
          sheetId,
          sheetName,
          passRate: 70,
          avgPerformance: 75,
          attendanceRate: 85,
          coursePopularity: "N/A",
          passRateIncrease: "N/A",
          avgPerformanceIncrease: "N/A",
          attendanceRateIncrease: "N/A",
      });
      await previousData.save();
  
      return res.json({
        message: "Metrics initialized for the first time",
          currentMetrics: {
            passRate: `${passRate.toFixed(2)}%`,
            avgPerformance: avgPerformance.toFixed(2),
            attendanceRate: `${attendanceRate.toFixed(2)}%`,
            coursePopularity: mostUsedCourse,
        },
          percentageIncreases: {
            passRateIncrease: "N/A",
            avgPerformanceIncrease: "N/A",
            attendanceRateIncrease: "N/A",
        },
      });
    }

    const passRateIncrease = calcPercentageIncrease(passRate, previousData.passRate);
    const avgPerformanceIncrease = calcPercentageIncrease(avgPerformance, previousData.avgPerformance);
    const attendanceRateIncrease = calcPercentageIncrease(attendanceRate, previousData.attendanceRate);

      previousData.passRate = passRate;
      previousData.avgPerformance = avgPerformance;
      previousData.attendanceRate = attendanceRate;
      previousData.coursePopularity = mostUsedCourse;
      previousData.passRateIncrease = passRateIncrease;
      previousData.avgPerformanceIncrease = avgPerformanceIncrease;
      previousData.attendanceRateIncrease = attendanceRateIncrease;
      previousData.lastUpdated = Date.now();
      await previousData.save();
  
      res.json({
        currentMetrics: {
          passRate: `${passRate.toFixed(2)}%`,
          avgPerformance: avgPerformance.toFixed(2),
          attendanceRate: `${attendanceRate.toFixed(2)}%`,
          coursePopularity: mostUsedCourse,
        },
        percentageIncreases: {
          passRateIncrease,
          avgPerformanceIncrease,
          attendanceRateIncrease,
      },
    });
  } catch (error) {
    console.error("Error calculating metrics:", error.message || error);
    res.status(500).json({ error: "Failed to calculate metrics", details: error.message });
  }
};

// @desc    Sheet data statistics of analyzed data
// @route   GET /api/educational-data-sheet/sheet-statsitics
// @access  Public
const getStatistics = async (req, res) => {
  try {
    const data = await Previous.find().sort({ lastUpdated: -1 }).limit(1); // Fetch the most recent record
    if (!data || data.length === 0) {
      return res.status(404).json({ 
        message: "No statistics data found" 
      });
    }

    const [latestData] = data; 
    // console.log("data"+latestData)
    const response = {
      passRate: latestData.passRate,
      avgPerformance: latestData.avgPerformance,
      attendanceRate: latestData.attendanceRate,
      coursePopularity: latestData.coursePopularity,
      passRateIncrease: latestData.passRateIncrease,
      attendanceRateIncrease: latestData.attendanceRateIncrease,
      avgPerformanceIncrease: latestData.avgPerformanceIncrease
    };

    res.status(200).json({ 
      success: "success", 
      data: response 
    });
  } catch (error) {
    console.error("Error fetching statistics data:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}  

// @desc    Sheet rows data (formatted data)
// @route   GET /api/educational-data-sheet/sheet-rows-data
// @access  Public
const getSheetDataTable = async(req, res) => {
  try {
    const { sheetId, sheetName } = req.query;
    if (!sheetId || !sheetName) {
      return res.status(404).json({ 
        error: "Please select valid sheet id and sheet name" 
      });
    }
    // console.log(sheetId, sheetName);

    // Fetch available sheets metadata
    const metadataResponse = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
      key: API_KEY,
    });

    const availableSheets = metadataResponse.data.sheets.map((sheet) => sheet.properties.title);
    // console.log(availableSheets);
    if (!availableSheets.includes(sheetName)) {
      return res.status(400).json({ 
        error: "Invalid sheet name", 
        availableSheets 
      });
    }

    // Fetch sheet values
    const range = `${sheetName}!A1:G100`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
      key: API_KEY,
    });

    const rows = response.data.values;
    if (!rows) {
      throw new Error("No data found in the specified sheet range.");
    }
    // console.log(rows);

    // Format Data
    const formattedData = formatSheetData(rows);
    // console.log("format data rows: "+JSON.stringify(formattedData, null, 2));

    res.status(200).json({
      status: "succes",
      formattedData
    });
  } catch (error) {
    console.error("Error fetching sheet data:", error.message || error);
    res.status(500).json({ error: "Failed to fetch sheet data", details: error.message });
  }
}

// @desc    Sheet names of []
// @route   GET /api/educational-data-sheet/sheet-names
// @access  Public
const getSheetNames = async (req, res) => {
  try {
    const { sheetId } = req.query; 

    if (!sheetId) {
      return res.status(400).json({ error: "Sheet ID is required." });
    }

    const sheetEntry = await SheetIDandName.findOne({ sheetId });

    if (!sheetEntry) {
      return res.status(404).json({ error: "Sheet data not found in the database." });
    }

    const sheetNames = sheetEntry.sheetName;
    // console.log("Available sheets:", sheetNames);

    return res.json({
      status: "success",
      sheets: sheetNames,
    });
  } catch (error) {
    console.error("Error fetching sheet names:", error.message);
    return res.status(500).json({ error: "Failed to fetch sheet names." });
  }
};

// @desc    Update sheet analyzed data
// @route   POST /api/educational-data-sheet/sheet-names
// @access  Public
const updateMetricsForAllSheets = async () => {
  try {
    const sheetsData = await SheetIDandName.find();

    if (sheetsData.length === 0) {
      console.log("No sheets found for processing.");
      return;
    }

    for (const sheet of sheetsData) {
      const { sheetId, sheetName } = sheet;
      
      // console.log(`Processing sheet - ID: ${sheetId}, Name: ${sheetName}`);

      if (!sheetId || !sheetName) {
        console.error(`Skipping sheet due to missing ID or Name - Received: ${JSON.stringify(sheet)}`);
        continue;
      }

      try {
        const { passRate, avgPerformance, attendanceRate, mostUsedCourse } =
          await calculateMetrics(sheetId, sheetName);

        let previousData = await Previous.findOne({ sheetId, sheetName });

        if (!previousData) {
          previousData = new Previous({
            sheetId,
            sheetName,
            passRate: 70,
            avgPerformance: 75,
            attendanceRate: 85,
            coursePopularity: "N/A",
            passRateIncrease: "N/A",
            avgPerformanceIncrease: "N/A",
            attendanceRateIncrease: "N/A",
          });
          await previousData.save();
          // console.log(`Initialized metrics for sheet: ${sheetName}`);
          continue;
        }

        // console.log(`Previous Data for ${sheetName}:`, previousData);

        const passRateIncrease = calcPercentageIncrease(passRate, previousData.passRate);
        const avgPerformanceIncrease = calcPercentageIncrease(avgPerformance, previousData.avgPerformance);
        const attendanceRateIncrease = calcPercentageIncrease(attendanceRate, previousData.attendanceRate);

        previousData.passRate = passRate;
        previousData.avgPerformance = avgPerformance;
        previousData.attendanceRate = attendanceRate;
        previousData.coursePopularity = mostUsedCourse;
        previousData.passRateIncrease = passRateIncrease;
        previousData.avgPerformanceIncrease = avgPerformanceIncrease;
        previousData.attendanceRateIncrease = attendanceRateIncrease;
        previousData.lastUpdated = Date.now();
        await previousData.save();

        console.log(`Updated Data for ${sheetName}:`, previousData);
      } catch (error) {
        console.error(`Error processing sheet ${sheetName}:`, error.message || error);
      }
    }
  } catch (error) {
    console.error("Error updating metrics:", error.message || error);
  }
};

// @desc    Schedule monthly updates of sheet
// @access  Private
cron.schedule("0 0 1 * *", async () => {
  console.log(`Cron Job Started at ${new Date().toISOString()}`);
  await updateMetricsForAllSheets();
  console.log(`Cron Job Finished at ${new Date().toISOString()}`);
});


module.exports = { postSheetNames, postSheetAnalysis, getStatistics, getSheetDataTable, getSheetNames };