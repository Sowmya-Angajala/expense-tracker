# expense-tracker
 
A mobile-first personal finance app built in React. Track income and expenses, visualise spending by category, and review trends across months — all persisted locally in the browser.
 
---

## Live Link : [Financial Serenity](https://expense-tracker-eta-flax-19.vercel.app/)
 
## Setup Instructions

```bash
git clone https://github.com/Sowmya-Angajala/expense-tracker.git
cd Front-end
npm install
npm run dev

```

## Key Decisions

### Reusable Components
Made componet to reduce the code duplication like Barchart,DonutChart,cards 

### CSS custom properties for theming

### Responsive layout strategy — mobile-first, three tiers

| Breakpoint | Layout |
|---|---|
| `< 700px` | Single column, fixed bottom nav with FAB |
| `700px – 1023px` | Sidebar collapses to icon-only strip, bottom nav hidden |
| `≥ 1024px` | Sidebar expands with labels; dashboard hero + recent list go side-by-side |
| `≥ 1280px` | Content centres at `900px` max-width; analytics cards grid into two columns |
 
The sidebar is present in the DOM on all sizes and toggled purely via CSS (`display: none` on mobile). This avoids layout flash on resize and keeps the JSX free of window-width checks

### useReducer + localStorage
A single `useReducer` handles all mutations (add, edit, delete). Every action writes the new state to `localStorage` synchronously before returning. This is intentionally simple — no context, no custom hook — because the state is a flat array and there is only one consumer. For a real product with multiple features sharing transaction data, wrapping this in a Context would be the natural next step.

### Form validation — optimistic, inline
Errors only appear after the first save attempt (`validate()` is called in `handleSave`, not on every keystroke). This avoids annoying the user while they're mid-input. Each error message sits directly below its field so the eye doesn't have to travel.


## What I'd Improve With More Time
  - Skeleton loading states
  - Theme changer black/white
  - AI integration which will provide proper suggestion through reports will guide user financially 

## Tech stacks : 
 - React
 - CSS
 - Chart.js



 expense-tracker/
├── index.html
├── eslint.config.js
├── .gitignore
│
└── Front-end/
    ├── App.css
    ├── App.jsx
    ├── index.css
    ├── main.jsx                    
    │
    ├── public/
    │
    └── src/
        │
        ├── assets/     
        │
        ├── Component/
        │   │
        │   ├── Charts/
        │   │   ├── BarChart.jsx  
        │   │   └── DonutChart.jsx  
        │   │
        │   ├── Icons/
        │   │   └── Icons.jsx   
        │   │
        │   ├── AddTransactionScreen.jsx
        │   ├── AnalyticsScreen.jsx   
        │   ├── DashBoardScreen.jsx   
        │   ├── Sidebar.jsx           
        │   ├── TransactionItem.jsx
        │   ├── TransactionModal.jsx     
        │   └── TransactionScreen.jsx  
        │
        ├── Reducer/
        │   └── reducer.js    
        │
        ├── styles/
        │   └── global.css   
        │
        └── utils/
            └── helpers.js  












