
import React from 'react'
import { useState, useEffect, useReducer, useCallback, useMemo } from "react";
import { CATEGORIES, groupByDate, INCOME_CATS } from '../utils/helpers';
import Icon from './Icons/Icons';
import TxItem from './TxItem';

function TxScreen({ txns, onTxClick }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const allChips = [
        { id: "all", label: "All" },
        ...CATEGORIES.map(c => ({ id: c.id, label: c.label })),
        ...INCOME_CATS.slice(0, 2).map(c => ({ id: c.id, label: c.label })),
    ];

    const filtered = useMemo(() => {
        return [...txns]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .filter(t => {
                const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                    (t.note || "").toLowerCase().includes(search.toLowerCase());
                const matchFilter = filter === "all" || t.category === filter;
                return matchSearch && matchFilter;
            });
    }, [txns, search, filter]);

    const groups = groupByDate(filtered);

    return (
        <div className="screen">
            <div className="screen-header" style={{ paddingBottom: 0 }}>
                <h1 className="screen-title">Transactions</h1>
            </div>

            <div className="search-wrap">
                <span className="search-icon"><Icon name="search" size={16} /></span>
                <input className="search-input" placeholder="Search transactions…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="filter-wrap">
                <div className="filter-chips">
                    {allChips.map(c => (
                        <button key={c.id} className={`chip ${filter === c.id ? "active" : ""}`} onClick={() => setFilter(c.id)}>
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <Icon name="search" size={48} />
                    <p>{search || filter !== "all" ? "No matching transactions." : "No transactions yet."}</p>
                </div>
            ) : (
                Object.entries(groups).map(([label, items]) => (
                    <div key={label} className="date-group">
                        <div className="date-label">{label}</div>
                        <div className="tx-list">
                            {items.map(t => <TxItem key={t.id} tx={t} onClick={onTxClick} />)}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default TxScreen;