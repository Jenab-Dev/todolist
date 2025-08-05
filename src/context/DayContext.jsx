// src/context/TaskContext.jsx
import { createContext, useState, } from "react";

export const DayContext = createContext(null);

export const DayProvider = ({ children }) => {
    const [currentDay, setCurrentDay] = useState();

    return (
        <DayContext.Provider value={{currentDay, setCurrentDay}}>
                {children}
        </DayContext.Provider>
    );
};
