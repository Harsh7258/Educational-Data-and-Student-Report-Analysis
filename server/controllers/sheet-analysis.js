const { google } = require("googleapis");
const sheets = google.sheets("v4");
const API_KEY = process.env.API_KEY;

// @GET 
// sheet data for specific rows of sheet
const getSheetData = async(sheetId, sheetName) => { 
  try {
    console.log(`Fetching data for Sheet: ${sheetName} (ID: ${sheetId})`);

    const ranges = [
      `${sheetName}!E2:E`, // Quiz Scores
      `${sheetName}!F2:F`, // Attendance
      `${sheetName}!G2:G`, // Course Names
    ];

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: sheetId,
      ranges,
      key: API_KEY, // API Key for authentication
    });

    return response.data.valueRanges || [];
  } catch (error) {
    console.error(`Error fetching sheet data for ${sheetName}:`, error.message);
    throw new Error("Failed to fetch sheet data");
  }
};

// @FORMAT 
// sheet data for frontend specific usage
const formatSheetData = (sheetData) => {
      if (!Array.isArray(sheetData) || sheetData.length < 2) {
        return [];
      }

      const dataRows = sheetData.slice(1);
      // console.log("rows: "+dataRows)
      return dataRows.map((row) => ({
          date: row[0] || '', 
          studentId: row[1] || '',
          name: row[2] || '',
          quizName: row[3] || '', 
          quizScore: row[4] || '',
          attendence: row[5] || '',
          course: row[6] || '',
      }));
};

// @CALCULATE 
// sheet data using google sheet api for analyzing student data
const calculateMetrics = async (sheetId, sheetName) => {
  try {
    // const sheets = google.sheets({ version: "v4", auth: API_KEY });
    console.log(`Fetching and analyzing data for Sheet: ${sheetName} (ID: ${sheetId})`);
    const sheetData = await getSheetData(sheetId, sheetName);

    if (!sheetData || sheetData.length < 3) {
      console.error("No valid data found in the sheet.");
    }  

    // Extract data
    const quizScores = sheetData[0]?.values || [];
    const attendance = sheetData[1]?.values || [];
    const courses = sheetData[2]?.values || [];
    const totalStudents = quizScores.length;

    // Calculate metrics
    const validScores = quizScores.map((score) => parseFloat(score[0])).filter((s) => !isNaN(s));
    const passingStudents = validScores.filter((score) => score >= 33).length;
    const passRate = totalStudents > 0 ? (passingStudents / totalStudents) * 100 : 0;

    const totalScore = validScores.reduce((sum, score) => sum + score, 0);
    const avgPerformance = totalStudents > 0 ? totalScore / totalStudents : 0;

    const validAttendance = attendance.map((att) => parseFloat(att[0])).filter((a) => !isNaN(a));
    const totalAttendance = validAttendance.reduce((sum, att) => sum + att, 0);
    const attendanceRate =
      validAttendance.length > 0 ? totalAttendance / validAttendance.length : 0;

    const courseCounts = {};
    courses.forEach((course) => {
      const courseName = course[0];
      if (courseName) {
        courseCounts[courseName] = (courseCounts[courseName] || 0) + 1;
      }
    });

    const mostUsedCourse = Object.entries(courseCounts).reduce(
      (max, current) => (current[1] > max[1] ? current : max),
      ["", 0]
    )[0];

    return { passRate, avgPerformance, attendanceRate, mostUsedCourse };
  } catch (error) {
    console.error("Error calculating metrics:", error.message || error);
    throw new Error("Metrics calculation failed");
  }
};

// @PERCENTAGE
// sheet data current and previous precentage increase 
const calcPercentageIncrease = (current, previous) => {
  if (previous === 0) return current > 0 ? "Infinity%" : "0%";
  return (((current - previous) / previous) * 100).toFixed(2) + "%";
};

module.exports = { calculateMetrics, calcPercentageIncrease, formatSheetData };


