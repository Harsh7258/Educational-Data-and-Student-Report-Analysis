import React, { useState, useEffect } from "react";
import { useSheet } from "@/context/SheetProvider";
import { Spinner } from "@material-tailwind/react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

export function Tables() {
  const { sheetId, sheetName } = useSheet();
  const [authorsTableData, setAuthorsTableData] = useState([]);

  const fetchSheetData = async () => {
    if (!sheetId || !sheetName) return;
    try {
      const response = await axios.get('http://localhost:5000/api/v1/sheet-data/sheet-rows-data', {
        params: { sheetId, sheetName },
      });
      
      setAuthorsTableData(response.data.formattedData);
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      alert('Failed to fetch data.');
    }
  };
  
  useEffect(() => {
    fetchSheetData();
  }, [sheetId, sheetName]);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Students Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Name", "Course", "TimeStamp", "Quiz Name", "Quiz Score", "Attendence"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              { Array.isArray(authorsTableData) && authorsTableData.length > 0 ? (
                authorsTableData.map(
                  ({ date, studentId, name, quizName, quizScore, attendence, course }, key) => {
                    const className = `py-3 px-5 ${
                      key === authorsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {name}
                              </Typography>
                              <Typography className="text-xs font-normal text-blue-gray-500">
                                Student ID: {studentId}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {course}
                          </Typography>
                        </td>
                        <td className={className}>
                          {/* <Chip
                            variant="gradient"
                            color={online ? "green" : "blue-gray"}
                            value={online ? "online" : "offline"}
                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                          /> */}
                          {date}
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {quizName}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            as="a"
                            href="#"
                            className="text-xs font-semibold text-blue-gray-600"
                          >
                            {quizScore}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {attendence}
                          </Typography>
                        </td>
                      </tr>
                    );
                  }
                )) : (
                  <tr>
                    <td colSpan="100%" className="text-center py-6">
                      <div className="flex justify-center items-center">
                        <Spinner className="h-16 w-16 text-gray-900/50" />
                      </div>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;
