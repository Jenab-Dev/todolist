import React, {
    useContext,
    useRef,
    useEffect,
    useState,
    useCallback,
    memo,
    createContext,
} from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { TaskContext, SetTaskContext } from "./context/TaskContext";
function HomePage() {
    const { day } = useParams();
    const tasks = useContext(TaskContext);
    const setTasks = useContext(SetTaskContext);
    const dayTasks = tasks[day] || [];
    const containerRef = useRef(null);
    const boxRefs = useRef([]);

    const [positions, setPositions] = useState(() => {
        const saved = localStorage.getItem(`positions-${day}`);
        return saved ? JSON.parse(saved) : {};
    });

    const [lines, setLines] = useState([]);

    // Update lines between boxes
    useEffect(() => {
        const refs = boxRefs.current;
        const container = containerRef.current?.getBoundingClientRect();
        let animationFrameId;

        const updateLines = () => {
            const newLines = [];

            for (let i = 0; i < refs.length - 1; i++) {
                const boxA = refs[i]?.getBoundingClientRect();
                const boxB = refs[i + 1]?.getBoundingClientRect();

                if (boxA && boxB && container) {
                    const x1 = boxA.left + boxA.width / 2 - container.left;
                    const y1 = boxA.top + boxA.height / 2 - container.top;
                    const x2 = boxB.left + boxB.width / 2 - container.left;
                    const y2 = boxB.top + boxB.height / 2 - container.top;
                    newLines.push({ x1, y1, x2, y2 });
                }
            }

            setLines((prevLines) => {
                const isSame =
                    prevLines.length === newLines.length &&
                    prevLines.every((line, i) => {
                        const l2 = newLines[i];
                        return (
                            line.x1 === l2.x1 &&
                            line.y1 === l2.y1 &&
                            line.x2 === l2.x2 &&
                            line.y2 === l2.y2
                        );
                    });

                return isSame ? prevLines : newLines;
            });
            
            animationFrameId = requestAnimationFrame(updateLines);
        };

        animationFrameId = requestAnimationFrame(updateLines);
        window.addEventListener("resize", updateLines);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", updateLines);
        };
    }, []);

    const handleDragEnd = (e, info, id) => {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newX = info.point.x - containerRect.left - window.innerWidth / 2;
        const newY = info.point.y - containerRect.top - window.innerHeight / 2;

        setPositions((prev) => {
            const updated = { ...prev, [id]: { x: newX, y: newY } };
            localStorage.setItem(`positions-${day}`, JSON.stringify(updated));
            return updated;
        });
    };

    const handleEditTask = useCallback(
        (updatedTitle, taskId) => {
            setTasks((prev) => ({
                ...prev,
                [day]: prev[day].map((task) =>
                    task.id === taskId ? { ...task, title: updatedTitle } : task
                ),
            }));
        },
        [day, setTasks]
    );

    if (!tasks[day])
        return (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-shadow-md text-shadow-zinc-500 ">
                No tasks for day {day}
            </div>
        );
    return (
        <div
            ref={containerRef}
            className="w-full h-dvh relative overflow-hiddenselect-none "   
        >
               <p>
                        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 -translate-y-1/2 text-shadow-md text-shadow-zinc-500 ">
                Day {day}
            </div>
            </p>
            {/* Animated Lines */}
            <svg className="absolute w-full h-full pointer-events-none z-0">
                <defs>
                    <linearGradient
                        id="lineGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                </defs>
                {lines.map((line, index) => (
                    <motion.line
                        key={index}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="url(#lineGradient)"
                        strokeWidth={3}
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2 }}
                    />
                ))}
            </svg>

            {/* Draggable Boxes */}
            {tasks[day].map((task, index) => {
                const pos = positions[task.id] || { x: 0, y: 0 };
                return (
                    <>
                   
                    
                    <motion.div
                        key={task.id}
                        drag
                        dragMomentum={true}
                        dragConstraints={containerRef}
                        onDragEnd={(e, info) => handleDragEnd(e, info, task.id)}
                        initial={{ x: pos.x, y: pos.y }}
                        whileDrag={{ scale: 1.05, rotate: 5 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 5,
                        }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                       flex flex-col items-center justify-center z-10 
                       px-3 py-3 group cursor-grab active:cursor-grabbing
                       max-sm:scale-75
                       "
                        ref={(el) => (boxRefs.current[index] = el)}
                    >
                        <div
                            className={`relative top-4 z-10 bg-background h-8 w-20 outline-3  rounded-full 
                         
                        ${
                            task.completed === "pending" &&
                            "outline-amber-400 group-hover:outline-amber-300"
                        } 
                        ${
                            task.completed === true &&
                            "outline-green-300 group-hover:outline-green-400"
                        }
                        ${
                            task.completed === false &&
                            "outline-white group-hover:outline-accent-purple"
                        }


                        `}
                        ></div>
                        <div className="outline-none bg-card-back z-20 py-4 px-6 rounded-2xl shadow-xl text-shadow-white text-shadow-xs">

                            <input
                                placeholder="Enter Your Task"
                                type="text"
                                className="text-center field-sizing-content focus:outline-none"
                                value={task.title}
                                onChange={(e) =>
                                    handleEditTask(e.target.value, task.id)
                                }
                            />
                        </div>
                    </motion.div>
                    </>
                );
            })}
        </div>
    );
}

export default memo(HomePage);
