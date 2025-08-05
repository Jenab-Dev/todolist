import React, { memo, useContext, useState } from "react";

const Tasks = memo(function Tasks({ task, onRemove, onEdit, onToggle }) {
    return (
        <p
            className={`relative items-center justify-center text-center text-sm mt-2 border-b-2 border-card-border transition-all duration-200 pb-1 hover:text-amber-50 hover:border-accent-purple 
        ${
            task.completed === "pending" &&
            "text-amber-400 hover:text-amber-300"
        } 
        ${task.completed === true && "text-green-300 hover:text-green-400"}
        ${task.completed === false && "text-gray-500"}`}
        >
            <span
                className="absolute left-0 top-[-25%] cursor-pointer text-xl text-red-600 hover:text-red-400"
                onClick={() => onRemove(task.id)}
            >
                🗑
            </span>

            <input
                type="text"
                value={task.title}
                className="text-center outline-none w-full bg-transparent"
                maxLength={30}
                placeholder="Enter Your Task"
                onChange={(e) => onEdit(e.target.value, task.id)}
            />

            <span
                className="absolute right-0 top-0 cursor-pointer"
                onClick={() => onToggle(task.id)}
            >
                {task.completed === false && " ✘"}
                {task.completed === true && " ✔"}
                {task.completed === "pending" && "⏱︎ "}
            </span>
        </p>
    );
});

export default memo(Tasks, (prevProps, nextProps) => {
    return (
        prevProps.task.id === nextProps.task.id &&
        prevProps.task.title === nextProps.task.title &&
        prevProps.task.completed === nextProps.task.completed
    );
});
