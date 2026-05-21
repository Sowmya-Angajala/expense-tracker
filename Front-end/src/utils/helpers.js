export const formatCurrency = (num) => {
  return `$${Number(num).toLocaleString()}`;
};

export const groupByDate = (transactions) => {
  const groups = {};

  transactions.forEach((tx) => {
    const date = new Date(tx.date).toDateString();

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(tx);
  });

  return groups;
};


export const CATEGORIES = [
  { id:"food",     label:"Food",     emoji:"🍔", color:"#E86C3A" },
  { id:"shopping", label:"Shopping", emoji:"🛍️", color:"#9B59B6" },
  { id:"travel",   label:"Travel",   emoji:"✈️", color:"#2980B9" },
  { id:"rent",     label:"Rent",     emoji:"🏠", color:"#16A085" },
  { id:"health",   label:"Health",   emoji:"❤️", color:"#E74C3C" },
  { id:"leisure",  label:"Leisure",  emoji:"🎬", color:"#F39C12" },
  { id:"bills",    label:"Bills",    emoji:"📄", color:"#7F8C8D" },
  { id:"other",    label:"Other",    emoji:"…",  color:"#95A5A6" },
];
export const INCOME_CATS = [
  { id:"salary",   label:"Salary",   emoji:"💼", color:"#27AE60" },
  { id:"freelance",label:"Freelance",emoji:"💻", color:"#2980B9" },
  { id:"gift",     label:"Gift",     emoji:"🎁", color:"#E74C3C" },
  { id:"other",    label:"Other",    emoji:"…",  color:"#95A5A6" },
];
export const getCat = (id, type="expense") =>
  (type==="income" ? INCOME_CATS : CATEGORIES).find(c=>c.id===id) || CATEGORIES[7];
 
/* ─── Helpers ─── */
export const fmtCurrency = (n) => {
  const abs = Math.abs(n);
  return "$" + abs.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
};
export const today = () => new Date().toISOString().split("T")[0];
export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];



