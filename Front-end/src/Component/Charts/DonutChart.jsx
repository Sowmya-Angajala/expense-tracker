import { useState, useEffect, useReducer, useCallback, useMemo } from "react";

export const DONUT_COLORS = ["#1A1916", "#6B6760", "#9E9A93", "#C4BFB5", "#E2DED6", "#E86C3A", "#9B59B6", "#2980B9"];

function DonutChart({ data, size = 140, thickness = 28 }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    if (!total) return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={size / 2} cy={size / 2} r={(size - thickness) / 2} fill="none" stroke="var(--surface2)" strokeWidth={thickness} />
        </svg>
    );

    const r = (size - thickness) / 2;
    const circ = 2 * Math.PI * r;
    const cx = size / 2, cy = size / 2;
    let offset = 0;
    const slices = data.map((d, i) => {
        const pct = d.value / total;
        const dash = pct * circ;
        const gap = circ - dash;
        const slice = { ...d, dash, gap, offset: offset * circ, color: DONUT_COLORS[i % DONUT_COLORS.length] };
        offset += pct;
        return slice;
    });

    const topPct = data.length ? Math.round(data[0].value / total * 100) : 0;

    return (
        <div className="donut-chart" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
                {slices.map((s, i) => (
                    <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                        stroke={s.color} strokeWidth={thickness}
                        strokeDasharray={`${s.dash} ${s.gap}`}
                        strokeDashoffset={-s.offset}
                    />
                ))}
            </svg>
            <div className="donut-center">
                <span className="donut-pct">{topPct}%</span>
                <span className="donut-pct-label">{data[0]?.label || ""}</span>
            </div>
        </div>
    );
}


export default DonutChart;