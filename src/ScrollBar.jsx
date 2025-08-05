import React, { memo, use, useContext, useEffect, useRef, useState } from "react";
import { DATE } from "./DATE";
import Callender from "./Callender";
import jalaali from "jalaali-js";
import { useNavigate, useParams } from "react-router-dom";
import { TaskContext, SetTaskContext } from "./context/TaskContext";
import { DayContext } from "./context/DayContext";
function ScrollBar() {
    const {currentDay, setCurrentDay} = useContext(DayContext)
    const [days, setDays] = useState([]);
    const [month, setMonth] = useState("");
    const sliderRef = useRef(null);
    const dayRefs = useRef([]);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const navigate = useNavigate();
    const tasks = useContext(TaskContext);
    const setTasks = useContext(SetTaskContext);
    
    // Initialize month and days
    useEffect(() => {
        const { jm } = jalaali.toJalaali(new Date());
        setDays(DATE[jm].days);
        setMonth(DATE[jm].month);
    }, []);

    // Scroll to today's box automatically
    useEffect(() => {
        const { jd } = jalaali.toJalaali(new Date());
        const currentDayEl = dayRefs.current[currentDay? currentDay - 1 : jd - 1];
        
        if (currentDayEl) {
            currentDayEl.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            });
        }
    }, [days]);

    // Drag events
    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - sliderRef.current.offsetLeft;
        scrollLeft.current = sliderRef.current.scrollLeft;
        document.body.style.userSelect = "none";
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.25;
        sliderRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.body.style.userSelect = "";
    };

    const handleScroll = (offset) => {
        sliderRef.current.scrollBy({
            left: offset,
            top: offset,
            behavior: "smooth",
        });
    };
    // Touch events
    function navigateFun(i){
        navigate(`/home/${i + 1}`)
        setCurrentDay(i + 1)
    }
    const [isTouched, setIsTouched] = useState(false)
    function tochHandle(){
        setIsTouched(true)
        setTimeout(() => {
            setIsTouched(false)
        }, 500);

        
    }

    return (
        <>
            <h1 className="text-center text-xl font-bold tracking-widest relative top-4 text-[#DB3867] select-none">
                {month.toLocaleUpperCase()}
            </h1>

            <div
                className="flex flex-row max-sm:flex-col max-sm:space-y-10 max-sm:space-x-0 items-center justify-between h-[400px] w-full px-4 py-2 mt-6 overflow-x-scroll snap-both snap-mandatory space-x-10 hide-scrollbar cursor-grab active:cursor-grabbing scroll-smooth
                "
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                    WebkitOverflowScrolling: "touch",
                    touchAction: "pan-y",
                }}
            >
                {/* Scroll buttons */}
                <button
                    onClick={() => handleScroll(-200)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white p-2 rotate-90 rounded-full hover:bg-gray-800 text-3xl text-center select-none max-sm:rotate-180"
                >
                    🔻
                </button>
                <button
                    onClick={() => handleScroll(300)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white p-2 rotate-[270deg] rounded-full hover:bg-gray-800 text-3xl text-center select-none max-sm:rotate-0"
                >
                    🔻
                </button>

                {Array.from({ length: days }, (_, i) => (
                    <div
                        key={i}
                        ref={(el) => (dayRefs.current[i] = el)}
                        className={`snap-center shrink-0 w-1/4 h-full border-2 bg-card-back sm:border-card-border rounded-2xl shadow-sm sm:hover:border-accent-purple transition-all duration-300 cursor-pointer
                        max-sm:w-70
                        ${isTouched ? "border-accent-purple" : "border-card-border"}
                            `}
                        onClick={tochHandle}
                    >
                        <div
                            className="w-full h-full"
                            onClick={()=> navigateFun(i) }
                        >
                            <Callender
                                key={i}
                                day={i + 1}
                                dayTasks={tasks[i + 1] || []}
                                setTasks={setTasks}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default memo(ScrollBar);
