// src/context/TaskContext.jsx
import { createContext, useEffect, useState, useMemo } from "react";

export const TaskContext = createContext(null);
export const SetTaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem("tasks");
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    return (
        <TaskContext.Provider value={tasks}>
            <SetTaskContext.Provider value={setTasks}>
                {children}
            </SetTaskContext.Provider>
        </TaskContext.Provider>
    );
};
