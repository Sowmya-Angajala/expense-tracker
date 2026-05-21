import { useState, useEffect, useReducer, useCallback, useMemo } from "react";
import { CATEGORIES, INCOME_CATS, today } from "../utils/helpers";
import Icon from "./Icons/Icons";

function AddScreen({ onSave, editTx, onCancel }) {
  const [type, setType]       = useState(editTx?.type || "expense");
  const [amount, setAmount]   = useState(editTx ? String(Math.abs(editTx.amount)) : "");
  const [category, setCategory] = useState(editTx?.category || "");
  const [date, setDate]       = useState(editTx?.date || today());
  const [note, setNote]       = useState(editTx?.note || "");
  const [name, setName]       = useState(editTx?.name || "");
  const [errors, setErrors]   = useState({});
  const cats = type==="income" ? INCOME_CATS : CATEGORIES;
 
  const validate = () => {
    const e={};
    if(!amount||isNaN(parseFloat(amount))||parseFloat(amount)<=0) e.amount="Enter a valid amount";
    if(!category) e.category="Select a category";
    if(!name.trim()) e.name="Enter a description";
    if(!date) e.date="Select a date";
    setErrors(e); return Object.keys(e).length===0;
  };
  const handleSave = () => {
    if(!validate()) return;
    onSave({ id:editTx?.id||Date.now().toString(), type, amount:type==="income"?parseFloat(amount):-parseFloat(amount), category, date, note:note.trim(), name:name.trim() });
  };
 
  return (
    <div className="add-screen screen">
      <div className="add-screen-inner" style={{padding:"0 20px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 0 0"}}>
          <button onClick={onCancel} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text2)",padding:4}}><Icon name="x" size={20}/></button>
          <h1 className="screen-title">{editTx?"Edit Transaction":"Add Transaction"}</h1>
          <div style={{width:28}}/>
        </div>
        <div className="type-toggle" style={{margin:"20px 0 0"}}>
          <button className={`type-btn ${type==="expense"?"active":""}`} onClick={()=>{setType("expense");setCategory("")}}>Expense</button>
          <button className={`type-btn ${type==="income"?"active":""}`} onClick={()=>{setType("income");setCategory("")}}>Income</button>
        </div>
        <div className="amount-area">
          <span className="amount-currency">$</span>
          <input className="amount-input" type="number" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} min="0" step="0.01" autoFocus/>
          {errors.amount&&<div className="form-error">{errors.amount}</div>}
        </div>
        <div className="add-form-grid">
          <div className="form-section add-form-full">
            <div className="form-label">Description</div>
            <input className="form-input" placeholder="e.g. Whole Foods Market" value={name} onChange={e=>setName(e.target.value)}/>
            {errors.name&&<div className="form-error">{errors.name}</div>}
          </div>
          <div className="form-section add-form-full">
            <div className="form-label">Category</div>
            <div className="cat-grid">{cats.map(c=>(
              <button key={c.id} className={`cat-btn ${category===c.id?"active":""}`} onClick={()=>setCategory(c.id)}>
                <span className="cat-emoji">{c.emoji}</span>
                <span className="cat-name">{c.label}</span>
              </button>
            ))}</div>
            {errors.category&&<div className="form-error" style={{marginTop:8}}>{errors.category}</div>}
          </div>
          <div className="form-section">
            <div className="form-label">Date</div>
            <input className="form-input" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
            {errors.date&&<div className="form-error">{errors.date}</div>}
          </div>
          <div className="form-section">
            <div className="form-label">Note (optional)</div>
            <textarea className="form-textarea" placeholder="Add a note…" value={note} onChange={e=>setNote(e.target.value)}/>
          </div>
        </div>
        <button className="save-btn" style={{margin:"4px 0 0",width:"100%"}} onClick={handleSave}>
          {editTx?"Update Transaction":"Save Transaction"}
        </button>
      </div>
    </div>
  );
}

export default AddScreen;