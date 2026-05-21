import { createContext, useContext, useEffect, useState } from "react";

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

const initialData = [
  {
    id: Date.now(),
    type: "income",
    amount: 6500,
    category: "Salary",
    note: "Monthly Salary",
    date: new Date().toISOString(),
  },
  {
    id: Date.now() + 1,
    type: "expense",
    amount: 240,
    category: "Food",
    note: "Cafe",
    date: new Date().toISOString(),
  },
];

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (data) => {
    setTransactions((prev) => [
      {
        id: Date.now(),
        ...data,
      },
      ...prev,
    ]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  const totals = transactions.reduce(
    (acc, item) => {
      if (item.type === "income") {
        acc.income += Number(item.amount);
      } else {
        acc.expense += Number(item.amount);
      }

      acc.balance = acc.income - acc.expense;

      return acc;
    },
    {
      income: 0,
      expense: 0,
      balance: 0,
    }
  );

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        totals,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};