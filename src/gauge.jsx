import React, { useEffect, useRef } from "react";
import SvgGauge from "svg-gauge";

const defaultOptions = {
    animDuration: 1,
    showValue: true,
    initialValue: 0,
    max: 10
    // Ajoutez d'autres options par défaut selon vos besoins, par exemple dialStartAngle, dialEndAngle, dialRadius, etc.
};

const Gauge = ({ value }) => {
    const gaugeEl = useRef(null);
    const gaugeRef = useRef(null);

    useEffect(() => {
        if (!gaugeRef.current) {
            const options = { ...defaultOptions };
            gaugeRef.current = SvgGauge(gaugeEl.current, options);
        }
        gaugeRef.current.setValueAnimated(value, 1);
    }, [value]);

    return <div ref={gaugeEl} className="gauge-container" />;
};

export default Gauge;
