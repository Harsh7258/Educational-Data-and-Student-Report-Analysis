import axios from "axios";
import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const fetchStatisticsCardsData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/v1/sheet-data/analyze-sheet").catch((e) => console.log(e));
    const data = response.data?.data || [];
    // console.log(data);

    return [
      {
        color: "gray",
        icon: BanknotesIcon,
        title: "Pass Rate",
        value: data?.passRate.toFixed(1) || "N/A",
        footer: {
          color: parseFloat(data?.passRateIncrease) > 0 ? "text-green-500" : "text-red-500",
          value: parseFloat(data?.passRateIncrease) > 0 ? "+"+data?.passRateIncrease : data?.passRateIncrease,
          label: (data?.avgPerformanceIncrease) == '0.00%' ? "sheet not updated" : "than last data update",
        },
      },
      {
        color: "gray",
        icon: UsersIcon,
        title: "Avg. Performance",
        value: data.avgPerformance.toFixed(1) || "N/A",
        footer: {
          color: parseFloat(data?.avgPerformanceIncrease) > 0 ? "text-green-500" : "text-red-500",
          value: parseFloat(data?.avgPerformanceIncrease) > 0 ? "+"+data?.avgPerformanceIncrease : data?.avgPerformanceIncrease, // Replace with actual calculation if available
          label: (data?.avgPerformanceIncrease) == '0.00%' ? "sheet not updated" : "than last data performance",
        },
      },
      {
        color: "gray",
        icon: UserPlusIcon,
        title: "Attendance Rate",
        value: data.attendanceRate.toFixed(1) || "N/A",
        footer: {
          color: parseFloat(data?.attendanceRateIncrease) > 0 ? "text-green-500" : "text-red-500",
          value: parseFloat(data?.attendanceRateIncrease) > 0 ? "+"+data?.attendanceRateIncrease : data?.attendanceRateIncrease, // Replace with actual calculation if available
          label: "than last data rate",
        },
      },
      {
        color: "gray",
        icon: ChartBarIcon,
        title: "Course Popularity",
        value: data.coursePopularity || "N/A",
        footer: {
          color: "text-green-500",
          // value: "+5%", // Replace with actual calculation if available
          // label: "than last month",
        },
      },
    ];
  } catch (error) {
    console.error("Error fetching statistics data:", error);
    return []; 
  }
}
