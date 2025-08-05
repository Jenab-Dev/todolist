import React, { memo, useCallback, useContext, useEffect, useState } from "react";

import Tasks from "./Tasks";

function Callender({ day, dayTasks, setTasks }) {
    const handleNewTask = () => {
        const newTask = {
            id: Date.now(),
            title: "",
            completed: false,
        };
        setTasks((prev) => ({
            ...prev,
            [day]: [...(prev[day] || []), newTask],
        }));
    };

    const handleRemoveTask = useCallback(
        (taskId) => {
            setTasks((prev) => (
                {    
                ...prev,
                [day]: prev[day].filter((task) => task.id !== taskId),
            }));
        },
        [day, setTasks]
    );

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

    const handleToggleTask = useCallback(
        (taskId) => {
            setTasks((prev) => ({
                ...prev,
                [day]: prev[day].map((task) =>
                    task.id === taskId
                        ? {
                              ...task,
                              completed:
                                  task.completed === false
                                      ? "pending"
                                      : task.completed === "pending"
                                      ? true
                                      : false,
                          }
                        : task
                ),
            }));
        },
        [day, setTasks]
    );

    
    return (
        <div className="h-full rounded-xl group flex flex-col ">
            <p className={`text-center text-xl font-bold border-b-2 border-card-border transition-all duration-300 group-hover:border-accent-purple pb-1
            
            `}
            >
                {day}
            </p>

            <div className="flex flex-col gap-2 overflow-y-auto hide-scrollbar p-2 flex-1">
                {dayTasks.length > 0 ? (
                    dayTasks.map((task) => (
                        <Tasks
                            key={task.id}
                            task={task}
                            onRemove={handleRemoveTask}
                            onEdit={handleEditTask}
                            onToggle={handleToggleTask}
                        />
                    ))
                ) : (
                    <p className="text-center text-md text-gray-500 relative top-1/2">
                        Click To Enter
                    </p>
                )}
            </div>

            <p
                className="w-full text-center bg-accent-purple rounded-b-xl py-2 cursor-pointer"
                onClick={handleNewTask}
            >
                ADD
            </p>
        </div>
    );
}

// inside Callender.jsx
export default memo(Callender, (prev, next) => {
  return (
    prev.day === next.day &&
    prev.dayTasks.length === next.dayTasks.length &&
    prev.dayTasks.every((task, i) => {
      const nextTask = next.dayTasks[i];
      return (
        task.id === nextTask.id &&
        task.title === nextTask.title &&
        task.completed === nextTask.completed
      );
    })
  );
});
