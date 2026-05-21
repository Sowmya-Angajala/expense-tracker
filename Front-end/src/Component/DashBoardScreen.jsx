import { useState, useEffect, useReducer, useCallback, useMemo } from "react";
import { fmtCurrency } from "../utils/helpers";
import Icon from "./Icons/Icons";
import TxItem from "./TxItem";

function DashBoardScreen({ txns, onViewAll, onTxClick }) {
  const balance = txns.reduce((s,t)=>s+t.amount,0);
  const income  = txns.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount,0);
  const expense = txns.filter(t=>t.amount<0).reduce((s,t)=>s+Math.abs(t.amount),0);
 
  const now = new Date();
  const thisMonth = txns.filter(t=>{
    const d=new Date(t.date+"T00:00:00");
    return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
  });
  const lastMonth = txns.filter(t=>{
    const d=new Date(t.date+"T00:00:00");
    const lm=new Date(now.getFullYear(),now.getMonth()-1,1);
    return d.getMonth()===lm.getMonth()&&d.getFullYear()===lm.getFullYear();
  });
  const thisSpend=thisMonth.filter(t=>t.amount<0).reduce((s,t)=>s+Math.abs(t.amount),0);
  const lastSpend=lastMonth.filter(t=>t.amount<0).reduce((s,t)=>s+Math.abs(t.amount),0);
  const changePct=lastSpend>0?((thisSpend-lastSpend)/lastSpend*100):0;
 
  const recent = [...txns].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
 
  return (
    <div className="screen">
      <div className="screen-header" style={{padding:"20px 20px 16px"}}>
        <div>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--text3)",marginBottom:2}}>Financial Serenity</div>
        </div>
        <div style={{width:36,height:36,borderRadius:"50%",background:"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>👤</div>
      </div>
 
      <div className="dash-hero">
        <div className="dash-label">Total Balance</div>
        <div className="dash-amount">{fmtCurrency(balance)}</div>
        <div className="dash-change">
          {changePct>=0 ? <Icon name="arrowUpRight" size={12}/> : <Icon name="arrowDownLeft" size={12}/>}
          {Math.abs(changePct).toFixed(1)}% this month
        </div>
      </div>
 
      <div className="dash-cards">
        <div className="dash-card">
          <div className="dash-card-label"><Icon name="arrowDownLeft" size={12}/>Income</div>
          <div className="dash-card-amt income">{fmtCurrency(income)}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label"><Icon name="arrowUpRight" size={12}/>Expenses</div>
          <div className="dash-card-amt expense">{fmtCurrency(expense)}</div>
        </div>
      </div>
 
      <button className="analytics-banner" onClick={onViewAll}>
        <div className="banner-icon"><Icon name="trendingUp" size={20}/></div>
        <div className="banner-text">
          <div className="banner-title">Spend Analytics</div>
          <div className="banner-sub">
            {thisSpend>0 ? `$${thisSpend.toLocaleString("en-US",{maximumFractionDigits:0})} spent this month` : "No spending data yet"}
          </div>
        </div>
        <Icon name="chevronRight" size={16}/>
      </button>
 
      <div className="section-header">
        <span className="section-title">Recent Activity</span>
        <button className="view-all" onClick={onViewAll}>View All</button>
      </div>
 
      {recent.length===0 ? (
        <div className="empty-state">
          <Icon name="transactions" size={48}/>
          <p>No transactions yet.<br/>Tap + to add one.</p>
        </div>
      ) : (
        <div className="tx-list">
          {recent.map(t=><TxItem key={t.id} tx={t} onClick={onTxClick}/>)}
        </div>
      )}
    </div>
  );
}

export default DashBoardScreen;