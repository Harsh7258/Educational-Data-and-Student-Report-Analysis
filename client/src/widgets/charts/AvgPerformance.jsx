import { useState, useEffect } from "react";
import { lineGraphConfig } from "../../configs/charts-config";
import axios from "axios";
import { useSheet } from "@/context/SheetProvider";
import { Line } from "react-chartjs-2";
import { Spinner } from "@material-tailwind/react";

const AvgPerformance = () => {
    const { sheetId, sheetName } = useSheet();
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchAvgPerformance = async () => {
        setLoading(true);
            if(!sheetId || !sheetName){
                setLoading(false);
                return;
            }

        try {
          const response = await axios.get("http://localhost:5000/api/v1/sheet-data/average-performance", {
            params: { sheetId, sheetName },
          });
  
          const data = response.data?.data || [];
          const labels = data.map((d) => d.quizName);
          const current = data.map((d) => parseFloat(d.avgPerformance));
          const previous = data.map((d) => parseFloat(d.previousAvgPerformance));
  
          setChartData(lineGraphConfig(labels, current, previous));
        } catch (err) {
          alert("Failed to fetch average performance data.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAvgPerformance();
    }, [sheetId, sheetName]);
  
    if (loading) return <Spinner className="h-10 w-10" />;
    if (!chartData) return <p>No data available.</p>;
  
    return (
      <div className="w-full h-96 relative bg-white p-4 rounded-lg shadow">
        <Line data={chartData.data} options={chartData.options} />
      </div>
    );
}

export default AvgPerformance