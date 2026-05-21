import React from 'react'
import { useState, useEffect, useReducer, useCallback, useMemo } from "react";
import { fmtCurrency, getCat, MONTHS, SHORT_MONTHS } from '../utils/helpers';
import Icon from './Icons/Icons';
import DonutChart, { DONUT_COLORS } from './Charts/DonutChart';


const AnalyticsScreen = ({ txns }) => {
 const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
 
  const prev = ()=>{ if(month===0){setMonth(11);setYear(y=>y-1)}else setMonth(m=>m-1); };
  const next = ()=>{
    const n=new Date(now);
    if(year>n.getFullYear()||month>=n.getMonth()) return;
    if(month===11){setMonth(0);setYear(y=>y+1)}else setMonth(m=>m+1);
  };
 
  const monthTxns = txns.filter(t=>{
    const d=new Date(t.date+"T00:00:00");
    return d.getMonth()===month&&d.getFullYear()===year;
  });
  const expenses = monthTxns.filter(t=>t.amount<0);
  const totalExp = expenses.reduce((s,t)=>s+Math.abs(t.amount),0);
 
  // prev month comparison
  const pm=month===0?11:month-1, py=month===0?year-1:year;
  const prevMonthTxns=txns.filter(t=>{
    const d=new Date(t.date+"T00:00:00");
    return d.getMonth()===pm&&d.getFullYear()===py;
  });
  const prevExp=prevMonthTxns.filter(t=>t.amount<0).reduce((s,t)=>s+Math.abs(t.amount),0);
  const changePct=prevExp>0?((totalExp-prevExp)/prevExp*100):0;
 
  // category breakdown
  const catMap = {};
  expenses.forEach(t=>{
    catMap[t.category]=(catMap[t.category]||0)+Math.abs(t.amount);
  });
  const catData = Object.entries(catMap)
    .map(([id,value])=>({ id, value, label:getCat(id,"expense").label, emoji:getCat(id,"expense").emoji }))
    .sort((a,b)=>b.value-a.value);
 
  const donutData = catData.slice(0,6);
 
  // 6-month bar trend
  const bars = [];
  for(let i=5;i>=0;i--){
    let m=month-i, y=year;
    while(m<0){m+=12;y--;}
    const spend=txns
      .filter(t=>{ const d=new Date(t.date+"T00:00:00"); return d.getMonth()===m&&d.getFullYear()===y&&t.amount<0; })
      .reduce((s,t)=>s+Math.abs(t.amount),0);
    bars.push({label:SHORT_MONTHS[m],spend,isCurrent:i===0});
  }
  const maxBar=Math.max(...bars.map(b=>b.spend),1);
 
  return (
    <div className="analytics-screen screen">
      <div className="period-nav">
        <button className="period-btn" onClick={prev}><Icon name="chevronLeft" size={16}/></button>
        <span className="period-label">{MONTHS[month]} {year}</span>
        <button className="period-btn" onClick={next}><Icon name="chevronRight" size={16}/></button>
      </div>
 
      <div className="total-card">
        <div className="total-label">Total Expenditure</div>
        <div className="total-amount">{fmtCurrency(totalExp)}</div>
        {prevExp>0&&(
          <div className={`total-change ${changePct>0?"up":"down"}`}>
            {changePct>0?<Icon name="arrowUpRight" size={12}/>:<Icon name="arrowDownLeft" size={12}/>}
            {Math.abs(changePct).toFixed(1)}% vs last month
          </div>
        )}
      </div>
 
      {catData.length>0 ? (
        <div className="donut-wrap">
          <DonutChart data={donutData} size={140} thickness={26}/>
          <div className="donut-legend">
            {donutData.slice(0,5).map((d,i)=>(
              <div key={d.id} className="legend-item">
                <div className="legend-dot" style={{background:DONUT_COLORS[i%DONUT_COLORS.length]}}/>
                <span className="legend-name">{d.label}</span>
                <span className="legend-pct">{Math.round(d.value/totalExp*100)}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="donut-wrap" style={{justifyContent:"center",flexDirection:"column",gap:8,padding:"30px 20px"}}>
          <div style={{textAlign:"center",color:"var(--text3)",fontSize:13}}>No expenses this month</div>
        </div>
      )}
 
      {catData.length>0&&(
        <div className="cat-breakdown">
          <div className="breakdown-title">Spending Breakdown</div>
          {catData.map((d,i)=>(
            <div key={d.id} className="breakdown-row">
              <div className="breakdown-icon">{d.emoji}</div>
              <div className="breakdown-info">
                <div className="breakdown-name">{d.label}</div>
                <div className="breakdown-bar-wrap">
                  <div className="breakdown-bar" style={{width:`${d.value/totalExp*100}%`,background:DONUT_COLORS[i%DONUT_COLORS.length]}}/>
                </div>
              </div>
              <div className="breakdown-right">
                <div className="breakdown-amt">{fmtCurrency(d.value)}</div>
                <div className="breakdown-pct">{Math.round(d.value/totalExp*100)}%</div>
              </div>
            </div>
          ))}
        </div>
      )}
 
      <div className="trend-wrap">
        <div className="trend-title">6-Month Trend</div>
        <div className="bar-chart">
          {bars.map((b,i)=>(
            <div key={i} className="bar-col">
              <div className="bar-outer">
                <div className={`bar-inner ${b.isCurrent?"current-month":"other-month"}`}
                  style={{height:`${b.spend/maxBar*100}%`}}
                  title={`${b.label}: ${fmtCurrency(b.spend)}`}
                />
              </div>
              <div className="bar-month">{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}

export default AnalyticsScreen
