import { useState, useEffect, useReducer, useCallback, useMemo } from "react";
import { fmtCurrency, getCat } from "../utils/helpers";

function TxItem({ tx, onClick }) {
  const cat = getCat(tx.category, tx.type);
  const isPos = tx.amount > 0;
  return (
    <div className="tx-item" onClick={()=>onClick(tx)}>
      <div className="tx-icon">{cat.emoji}</div>
      <div className="tx-info">
        <div className="tx-name">{tx.name}</div>
        <div className="tx-cat">{cat.label}</div>
      </div>
      <div className="tx-right">
        <div className={`tx-amount ${isPos?"pos":"neg"}`}>{isPos?"+":"−"}{fmtCurrency(tx.amount)}</div>
      </div>
    </div>
  );
}

export default TxItem;