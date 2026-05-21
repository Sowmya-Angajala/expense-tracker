import { useState, useEffect, useReducer, useCallback, useMemo } from "react";
import AddScreen from "./Component/AddScreen";
import DashBoardScreen from "./Component/DashBoardScreen";
import TxScreen from "./Component/TxScreen";
import AnalyticsScreen from "./Component/AnalyticsScreen";
import { init, reducer } from "./Reducer/reducer";
import Icon from "./Component/Icons/Icons";
import TxModal from "./Component/TxModal";
import Sidebar from "./Component/Sidebar";
 


function App() {
  const [txns, dispatch] = useReducer(reducer, null, init);
  const [screen, setScreen] = useState("dashboard");
  const [showAdd, setShowAdd] = useState(false);
  const [editTx, setEditTx]   = useState(null);
  const [viewTx, setViewTx]   = useState(null);
 
  const handleSave = tx => { dispatch({type:editTx?"EDIT":"ADD",tx}); setShowAdd(false); setEditTx(null); };
  const handleDelete = id => { dispatch({type:"DELETE",id}); setViewTx(null); };
  const openEdit = () => { setEditTx(viewTx); setViewTx(null); setShowAdd(true); };
  const openAdd  = () => { setEditTx(null); setShowAdd(true); };
 
  return (
    <>
     <div className="app-root">
        <div className="app-body">
          {/* Sidebar — hidden on mobile via CSS */}
          {!showAdd && <Sidebar screen={screen} setScreen={setScreen} onAdd={openAdd}/>}
 
          <div className="main-content">
            {showAdd
              ? <AddScreen onSave={handleSave} editTx={editTx} onCancel={()=>{setShowAdd(false);setEditTx(null);}}/>
              : screen==="dashboard"    ? <DashBoardScreen txns={txns} onViewAll={()=>setScreen("transactions")} onTxClick={setViewTx}/>
              : screen==="transactions" ? <TxScreen txns={txns} onTxClick={setViewTx}/>
              :                          <AnalyticsScreen txns={txns}/>
            }
          </div>
        </div>
 
        {/* Bottom nav — mobile only via CSS */}
        {!showAdd && (
          <nav className="bottom-nav">
            <button className={`nav-item ${screen==="dashboard"?"active":""}`} onClick={()=>setScreen("dashboard")}><Icon name="dashboard" size={22}/>Home</button>
            <button className={`nav-item ${screen==="transactions"?"active":""}`} onClick={()=>setScreen("transactions")}><Icon name="transactions" size={22}/>Activity</button>
            <button className="nav-add-mobile" onClick={openAdd} aria-label="Add transaction"><Icon name="plus" size={24}/></button>
            <button className={`nav-item ${screen==="analytics"?"active":""}`} onClick={()=>setScreen("analytics")}><Icon name="analytics" size={22}/>Analytics</button>
            <div style={{width:52}}/>
          </nav>
        )}
 
        {viewTx && <TxModal tx={viewTx} onEdit={openEdit} onDelete={()=>handleDelete(viewTx.id)} onClose={()=>setViewTx(null)}/>}
      </div>
    </>
  );
}

export default App;