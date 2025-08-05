import React, { useState } from "react";
import ScrollBar from "./ScrollBar";

function Nav(props) {
    const [isMouseEntered, setisMouseEntered] = useState(true);

    const handleMouse = (p) => {
        setisMouseEntered((m) => p);
    };
    return (
        <div
            className={`z-50 w-full h-[500px] absolute  bg-card-bg text-primary flex flex-col justify-between opacity-50 hover:opacity-99 hover:top-0 transition-all duration-400 hide-scrollbar 
            ${isMouseEntered? "top-0 opacity-99" : "top-[-450px] "}
                `}
            onMouseEnter={() => handleMouse(true)}
            onMouseLeave={() => handleMouse(false)}
        >
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {isMouseEntered && <ScrollBar isMouseEntered={isMouseEntered} />}
            <p className={`w-full text-center text-3xl select-none justify-self-end self-center mt-auto ${isMouseEntered ? "rotate-180" : "rotate-0"} transition-all duration-400 `}
            onClick={()=>setisMouseEntered(prev => !prev)}>🔻</p>
        </div>
    );
}

export default Nav;
