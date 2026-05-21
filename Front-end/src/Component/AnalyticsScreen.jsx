import React from 'react'
import { useState, useEffect, useReducer, useCallback, useMemo } from "react";
import { fmtCurrency, getCat, MONTHS, SHORT_MONTHS } from '../utils/helpers';
import Icon from './Icons/Icons';
import DonutChart, { DONUT_COLORS } from './Charts/DonutChart';
import BarChart from './Charts/BarChart';


function AnalyticsScreen({ txns }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1); };
  const next = () => { if (year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth())) return; if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1); };

  const expenses = txns.filter(t => { const d = new Date(t.date + "T00:00:00"); return d.getMonth() === month && d.getFullYear() === year && t.amount < 0; });
  const totalExp = expenses.reduce((s, t) => s + Math.abs(t.amount), 0);
  const pm = month === 0 ? 11 : month - 1, py = month === 0 ? year - 1 : year;
  const prevExp = txns.filter(t => { const d = new Date(t.date + "T00:00:00"); return d.getMonth() === pm && d.getFullYear() === py && t.amount < 0; }).reduce((s, t) => s + Math.abs(t.amount), 0);
  const changePct = prevExp > 0 ? ((totalExp - prevExp) / prevExp * 100) : 0;

  const catMap = {};
  expenses.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + Math.abs(t.amount); });
  const catData = Object.entries(catMap).map(([id, value]) => ({ id, value, label: getCat(id, "expense").label, emoji: getCat(id, "expense").emoji })).sort((a, b) => b.value - a.value);

  const bars = [];
  for (let i = 5; i >= 0; i--) {
    let m = month - i, y = year; while (m < 0) { m += 12; y--; }
    const spend = txns.filter(t => { const d = new Date(t.date + "T00:00:00"); return d.getMonth() === m && d.getFullYear() === y && t.amount < 0; }).reduce((s, t) => s + Math.abs(t.amount), 0);
    bars.push({ label: SHORT_MONTHS[m], spend, isCurrent: i === 0 });
  }
  const maxBar = Math.max(...bars.map(b => b.spend), 1);


  const sixMonthBars = useMemo(() => {
    const result = [];

    for (let i = 5; i >= 0; i--) {
      const tempDate = new Date(year, month - i, 1);

      const m = tempDate.getMonth();
      const y = tempDate.getFullYear();

      const total = txns
        .filter((t) => {
          const d = new Date(t.date + "T00:00:00");

          return (
            d.getMonth() === m &&
            d.getFullYear() === y &&
            t.amount < 0
          );
        })
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      result.push({
        label: SHORT_MONTHS[m],
        value: total,
      });
    }

    return result;
  }, [txns, month, year]);


  const sevenDayBars = useMemo(() => {
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);

      const total = txns
        .filter((t) => {
          const d = new Date(t.date + "T00:00:00");

          return (
            d.getDate() === day.getDate() &&
            d.getMonth() === day.getMonth() &&
            d.getFullYear() === day.getFullYear() &&
            t.amount < 0
          );
        })
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      result.push({
        label: day.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        value: total,
      });
    }

    return result;
  }, [txns]);

  return (
    <div className="analytics-screen screen">
      <div className="screen-inner">
        <div className="period-nav px" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", margin: "0 -20px", padding: "16px 20px" }}>
          <button className="period-btn" onClick={prev}><Icon name="chevronLeft" size={16} /></button>
          <span className="period-label">{MONTHS[month]} {year}</span>
          <button className="period-btn" onClick={next}><Icon name="chevronRight" size={16} /></button>
        </div>

        <div className="total-card">
          <div className="total-label">Total Expenditure</div>
          <div className="total-amount">{fmtCurrency(totalExp)}</div>
          {prevExp > 0 && <div className={`total-change ${changePct > 0 ? "up" : "down"}`}>
            {changePct > 0 ? <Icon name="arrowUpRight" size={12} /> : <Icon name="arrowDownLeft" size={12} />}
            {Math.abs(changePct).toFixed(1)}% vs last month
          </div>}
        </div>

        {/* Two-col grid on wide */}
        <div className="analytics-grid">
          <div>
            {catData.length > 0
              ? <div className="donut-wrap"><DonutChart data={catData.slice(0, 6)} size={140} thickness={26} /><div className="donut-legend">{catData.slice(0, 5).map((d, i) => <div key={d.id} className="legend-item"><div className="legend-dot" style={{ background: DONUT_COLORS[i] }} /><span className="legend-name">{d.label}</span><span className="legend-pct">{Math.round(d.value / totalExp * 100)}%</span></div>)}</div></div>
              : <div className="donut-wrap" style={{ justifyContent: "center" }}><div style={{ textAlign: "center", color: "var(--text3)", fontSize: 13 }}>No expenses this month</div></div>
            }
          </div>

          <div>
            {catData.length > 0 && (
              <div className="cat-breakdown">
                <div className="breakdown-title">Spending Breakdown</div>
                {catData.map((d, i) => (
                  <div key={d.id} className="breakdown-row">
                    <div className="breakdown-icon">{d.emoji}</div>
                    <div className="breakdown-info">
                      <div className="breakdown-name">{d.label}</div>
                      <div className="breakdown-bar-wrap"><div className="breakdown-bar" style={{ width: `${d.value / totalExp * 100}%`, background: DONUT_COLORS[i % DONUT_COLORS.length] }} /></div>
                    </div>
                    <div className="breakdown-right">
                      <div className="breakdown-amt">{fmtCurrency(d.value)}</div>
                      <div className="breakdown-pct">{Math.round(d.value / totalExp * 100)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="analytics-full">
            <BarChart
              title="6-Month Trend"
              data={sixMonthBars}
              currentKey={SHORT_MONTHS[month]}
            />
          </div>

          <div className="analytics-full">
            <BarChart
              title="Last 7 Days"
              data={sevenDayBars}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsScreen
