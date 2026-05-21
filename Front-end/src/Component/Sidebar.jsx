import { useState, useEffect, useReducer, useCallback, useMemo } from "react";
import Icon from "./Icons/Icons";

function Sidebar({ screen, setScreen, onAdd }) {
  const navItems = [
    { id:"dashboard", icon:"dashboard", label:"Home" },
    { id:"transactions", icon:"transactions", label:"Activity" },
    { id:"analytics", icon:"analytics", label:"Analytics" },
  ];
  return (
    <div className="sidebar">
      <div className="brand">
        <div className="brand-dot"><Icon name="wallet" size={16}/></div>
        <span className="brand-text">Financial Serenity</span>
      </div>
      <div className="sidebar-nav">
        {navItems.map(n => (
          <button key={n.id} className={`sidebar-nav-item ${screen===n.id?"active":""}`} onClick={()=>setScreen(n.id)}>
            <Icon name={n.icon} size={20}/>
            <span className="nav-label">{n.label}</span>
          </button>
        ))}
      </div>
      <button className="add-sidebar-btn" onClick={onAdd}>
        <Icon name="plus" size={18}/>
        <span>Add Transaction</span>
      </button>
    </div>
  );
}

export default Sidebar;


 