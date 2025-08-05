import React from 'react';
import jalaali from 'jalaali-js';
function SolarDate(props) {
        const gregorianDate = new Date(); // or any Date
        const { jy, jm, jd } = jalaali.toJalaali(gregorianDate);
    return (
        {jy, jm, jd }
    )
}

export default SolarDate;