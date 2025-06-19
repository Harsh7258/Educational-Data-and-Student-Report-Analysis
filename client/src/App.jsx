import { Routes, Route, Navigate } from "react-router-dom";
import { Chart as ChartJs, 
  ArcElement, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  LineElement,
  PointElement,
  Title } from "chart.js";
import { SheetProvider } from "./context/SheetProvider";
import { Dashboard, Auth } from "@/layouts";

ChartJs.register(ArcElement, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  LineElement,
  PointElement,
  Title
);

function App() {
  return (
    <SheetProvider>
      <div>
        <Routes>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/auth/*" element={<Auth />} />
          <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
        </Routes>
      </div>
    </SheetProvider>
  );
}

export default App;
