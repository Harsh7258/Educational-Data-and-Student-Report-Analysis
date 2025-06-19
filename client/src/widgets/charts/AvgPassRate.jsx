import { useEffect, useState } from 'react';
import { useSheet } from '@/context/SheetProvider';
import axios from 'axios';
import { stackedBarGraphConfig } from '@/configs';
import { Bar } from 'react-chartjs-2';
import { Spinner } from '@material-tailwind/react';

const AvgPassRate = () => {
    const { sheetId, sheetName } = useSheet();
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if(!sheetId || !sheetName){
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/api/v1/sheet-data/quiz-data", {
                    params: { sheetId, sheetName },
                });

                const quizzes = response.data?.data || [];
                // console.log("✅ API Response Data:", response.data);
                
                const labels = quizzes.map((q) => q.quizName);
                const passRates = quizzes.map((q) => parseFloat(q.passRate));
                const failRates = quizzes.map((q) => parseFloat(q.failRate));
                // console.log(labels, passRates, failRates, quizzes)

                setChartData(stackedBarGraphConfig(labels, passRates, failRates));
            } catch (error) {
                alert("Error fetching quiz data");
                // console.error("Error fetching course data:", error);
                setChartData(null);
            } finally{
                setLoading(false);
            }
        };
        fetchData();
    }, [sheetId, sheetName]);

    if (loading) return <Spinner className="h-10 w-10 text-gray-900/50 text-center" />;
    if (!chartData) return <p>No quiz data available...</p>;
  
    
  return (
    <div className="w-full h-80 relative">
      <Bar {...chartData} />
    </div>
  )
}

export default AvgPassRate