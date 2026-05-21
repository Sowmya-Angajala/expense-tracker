import React from 'react'
import { useState, useEffect, useReducer, useCallback, useMemo } from "react";
import { fmtCurrency, getCat } from '../utils/helpers';
import Icon from './Icons/Icons';

function TransactionModal({ tx, onEdit, onDelete, onClose }) {
  const cat = getCat(tx.category, tx.type);
  return (
    <div className="modal-backdrop" onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-handle"/>
        <div className="modal-title">{tx.name}</div>
        <div style={{textAlign:"center",marginBottom:16}}>
          <span style={{fontSize:32}}>{cat.emoji}</span>
          <div style={{fontSize:22,fontWeight:600,marginTop:4}}>{tx.amount>0?"+":"−"}{fmtCurrency(tx.amount)}</div>
          <div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>{cat.label} · {new Date(tx.date+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
          {tx.note&&<div style={{fontSize:13,color:"var(--text2)",marginTop:8,fontStyle:"italic"}}>"{tx.note}"</div>}
        </div>
        <div className="modal-actions">
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-outline" onClick={onEdit}><Icon name="edit" size={14}/> Edit</button>
          <button className="btn-danger" onClick={onDelete}><Icon name="trash" size={14}/> Delete</button>
        </div>
      </div>
    </div>
  );
}

export default TransactionModal
