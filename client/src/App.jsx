import { Routes, Route, Navigate } from "react-router-dom";
import { SheetProvider } from "./context/SheetProvider";
import { Dashboard, Auth } from "@/layouts";

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
