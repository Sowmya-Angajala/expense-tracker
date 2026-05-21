export const init = () => {
  try {
    const stored = localStorage.getItem("fs_txns");
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};
 
export function reducer(state, action) {
  let next;
  switch(action.type) {
    case "ADD": next = [action.tx, ...state]; break;
    case "DELETE": next = state.filter(t=>t.id!==action.id); break;
    case "EDIT": next = state.map(t=>t.id===action.tx.id?action.tx:t); break;
    default: return state;
  }
  localStorage.setItem("fs_txns", JSON.stringify(next));
  return next;
}