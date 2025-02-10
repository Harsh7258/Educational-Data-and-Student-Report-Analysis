import React, { createContext, useContext, useState } from 'react'

const SheetContext = createContext();

export const SheetProvider = ({ children }) => {

  const [sheetId, setSheetId] = useState("");
  const [sheetName, setSheetName] = useState("");
  const [statisticsCards, setStatisticsCards] = useState([]);

  return (
    <SheetContext.Provider 
    value={{ sheetId, setSheetId, 
      sheetName, setSheetName, 
      statisticsCards, setStatisticsCards 
    }}>
      {children}
    </SheetContext.Provider>
  );
};

export const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a SheetProvider");
  }
  return context;
};

