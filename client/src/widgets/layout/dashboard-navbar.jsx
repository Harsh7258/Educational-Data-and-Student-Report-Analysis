import { useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { useSheet } from "@/context/SheetProvider";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Bars3Icon,
  DocumentChartBarIcon,
  DocumentArrowDownIcon
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";
import { fetchStatisticsCardsData } from "@/data";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [sheetUrl, setSheetUrl] = useState('');
  const { sheetId, setSheetId, sheetName, setSheetName,setStatisticsCards } = useSheet();
  const [sheetNames, setSheetNames] = useState([]);

  const extractSheetId = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  // Fetch Available Sheet Names from Backend
  const fetchSheetNames = async () => {
    const extractedSheetId = extractSheetId(sheetUrl);
    if (!extractedSheetId) {
      alert("Invalid Google Sheets URL");
      return;
    }

    setSheetId(extractedSheetId); 

    try {
      const response =  await axios.post('http://localhost:5000/api/v1/sheet-data/sheet-names', { sheetId: extractedSheetId });
      // console.log(response.data)
      const fetchedSheetNames = response.data.sheetName || [];
      
      setSheetNames(fetchedSheetNames);

      if (response.data.sheetName.length > 0) {
        setSheetName(response.data.sheetName[0]); 
      }
    } catch (error) {
      console.error("Error fetching sheet names:", error);
      alert("Failed to fetch sheet names.");
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Failed to fetch sheet names. Please try again.");
      }
    }
  };

  // Submit Selected Sheet for Analysis
  const handleSubmit = async () => {
    if (!sheetId || !sheetName) {
      alert("Please enter a valid Google Sheets URL and select a sheet.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/v1/sheet-data/analyze-sheet", {
        sheetId,
        sheetName: sheetName, 
      });

      // console.log(response.data);
      const updatedData = await fetchStatisticsCardsData();
      setStatisticsCards(updatedData);
    } catch (error) {
      // console.error("Error fetching sheet data:", error);
      alert("Failed to fetch data.");
    }
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input
              label="Analysis Link"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              // placeholder="Enter Google Sheets URL"
              size="lg"
            />
          </div>
          <Button variant="text" color="blue-gray" 
          className="hidden items-center gap-1 px-3 xl:flex normal-case" 
          onClick={fetchSheetNames}>
            Get Sheets
          </Button>
          <div className="flex w-28 flex-col gap-6">
            <select
              className={`w-full px-3 py-1.5 text-sm border text-blue-gray-500 border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                sheetNames.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              disabled={sheetNames.length === 0} 
            >
              {sheetNames.length === 0 ? (
                <option value="">No sheets</option>
              ) : (
                sheetNames.map((name) => (
                  <option key={name} value={name} className="text-sm text-blue-gray-500 bg-white hover:bg-gray-100">
                    {name}
                  </option>
                ))
              )}
            </select>
          </div>
          <Button
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-1 px-4 xl:flex normal-case"
              onClick={handleSubmit}
            >
              <DocumentChartBarIcon className="h-5 w-5 text-blue-gray-500"/>
              Analyze
          </Button>
          <Button
            variant="text"
            color="blue-gray"
            className="hidden items-center gap-1 px-4 xl:flex normal-case"
            disabled
          >
            <DocumentArrowDownIcon className="h-5 w-5 text-blue-gray-500" />
            Download
          </Button>
        </div>
        <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          <Link to="/auth/sign-in">
            <Button
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-1 px-4 xl:flex normal-case"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              Sign In
            </Button>
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
            </IconButton>
          </Link>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
