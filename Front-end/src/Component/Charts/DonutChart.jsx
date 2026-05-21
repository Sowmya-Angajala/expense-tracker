import { useState, useEffect, useReducer, useCallback, useMemo } from "react";

export const DONUT_COLORS = ["#1A1916", "#6B6760", "#9E9A93", "#C4BFB5", "#E2DED6", "#E86C3A", "#9B59B6", "#2980B9"];

function DonutChart({ data, size = 140, thickness = 26 }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    if (!total) return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}><circle cx={size / 2} cy={size / 2} r={(size - thickness) / 2} fill="none" stroke="var(--surface2)" strokeWidth={thickness} /></svg>;
    const r = (size - thickness) / 2, circ = 2 * Math.PI * r;
    let off = 0;
    const slices = data.map((d, i) => { const dash = (d.value / total) * circ; const s = { ...d, dash, gap: circ - dash, offset: off * circ, color: DONUT_COLORS[i % DONUT_COLORS.length] }; off += d.value / total; return s; });
    const topPct = Math.round(data[0].value / total * 100);
    return (
        <div className="donut-chart" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
                {slices.map((s, i) => (
                    <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={thickness} strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={-s.offset} />
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