import { TaskProvider } from "./context/TaskContext";
import { DayProvider } from "./context/DayContext";
import Nav from "./Nav";
import HomePage from "./HomePage";
import SolarDate from "./SolarDate";
import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { nav } from "framer-motion/client";
function RedirectToToday() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(`/home/${SolarDate().jd}`);
    }, [navigate]);
    return null;
}

function App() {
    return (
        <Router>
            <TaskProvider>  
                <DayProvider>
                    <Nav />
                    <Routes>
                        <Route path="/" element={<RedirectToToday />} />
                        <Route path="*" element={<RedirectToToday /> } />
                        <Route path="/home/:day" element={<HomePage />} />
                    </Routes>
                </DayProvider>         
            </TaskProvider>
        </Router>
    );
}

export default App;
