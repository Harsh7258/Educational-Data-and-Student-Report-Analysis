import { useState, useEffect } from "react";
import { useSheet } from "@/context/SheetProvider";
import axios from "axios";
import { doughnutChartConfig } from "@/configs";
import { Doughnut } from "react-chartjs-2";
import { Spinner } from "@material-tailwind/react"; 

const MostPopularCourse = () => {
  const { sheetId, sheetName } = useSheet();
  const [ courseLabels, setCourseLabels ] = useState([]);
  const [ courseData, setCourseData ] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      if (!sheetId || !sheetName) {
        setLoading(false);
        return;
      };

      try {
        const response = await axios.get("http://localhost:5000/api/v1/sheet-data/course-statistics", {
          params: { sheetId, sheetName },
        });

        // console.log("API Response Status:", response);
        // console.log("API Response Data:", response.data);
        if (!response.data || !response.data.data) {
          throw new Error("Invalid API response");
        }

        const courseCounts = response.data?.data?.courseData || {};
        
        setCourseLabels(Object.keys(courseCounts));
        setCourseData(Object.values(courseCounts));

      } catch (error) {
        alert("Error fetching course data");
        // console.error("Error fetching course data:", error);
        setCourseData(null);
        setCourseLabels(null);
      } finally{
        setLoading(false);
      }
    };
    fetchData();
  }, [sheetId, sheetName]);

  if (loading) return <Spinner className="h-10 w-10 text-gray-900/50" /> // Show loading state

  if (courseLabels.length === 0 || courseData.length === 0) {
    return <p>No course data available...</p>; 
  }

  return(
    <div className="w-full h-80 relative">
      <Doughnut {...doughnutChartConfig(courseData, courseLabels)} />
    </div>
  );
};

export default MostPopularCourse;