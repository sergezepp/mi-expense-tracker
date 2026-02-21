# AGENT_CODE: ExpenseTracer Context

This document provides complete architectural and functional context for the **ExpenseTracer** application.

## 🚀 Overview
**ExpenseTracer** is a professional personal finance management tool built to be fast, responsive, and persistent. It uses a server-side JSON file system for data storage, ensuring that records are maintained even when browser caches are cleared.

## 🛠 Technical Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Custom Emerald Green Theme)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Data Persistence**: Node.js `fs` module via Next.js Server Actions

## Development Workflow
- Before making any changes, create and checkout a feature branch named `feature-[brief-description]`
- Write comprehensive tests for all new functionality
- Compile code and run all tests before committing
- Write detailed commit messages explaining the changes and rationale
- Commit all changes to the feature branch

## Quality Gates
- All code must compile without warnings
- All tests must pass before committing

## 📂 Project Structure
- `src/app/page.tsx`: Main dashboard and transaction view integration.
- `src/components/`:
  - `Navbar.tsx`: Sticky navigation with "Add Expense" (scale-110) and "Export CSV".
  - `Dashboard.tsx`: Spending summaries and Bar charts using Recharts.
  - `ExpenseList.tsx`: Searchable, filterable table of transactions.
  - `ExpenseForm.tsx`: Modal form with validation and date handling.
  - `ui.tsx`: Reusable design system components (Button, Card, Input).
- `src/hooks/useExpenses.ts`: Custom hook managing state and server action calls.
- `src/lib/`:
  - `actions.ts`: **Server Actions** for CRUD operations on `data/db.json`.
  - `utils.ts`: Formatting (Currency, Date) and CSV export logic.
- `data/db.json`: Local JSON "database" file.

## 💎 Design System & Customization
- **Primary Color**: Emerald Green (`#10b981`).
- **Aesthetics**: Glassmorphism (`backdrop-blur`), clean borders, and professional typography.
- **Specific Adjustments**: 
  - "Add Expense" button increased by 10% (`scale-110`).
  - Fully responsive design (mobile-first approach).

## 📡 Persistence Layer
The app originally used `localStorage` but was refactored to a more robust server-side file-based system.
- Data is stored in `expense-tracker/data/db.json`.
- All operations (Add, Edit, Delete, Get) flow through `src/lib/actions.ts`.

## 🔗 Repository
**GitHub**: `https://github.com/sergezepp/mi-expense-tracker.git`

## 🏃 How to Run
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---
*Created by Antigravity AI to preserve project context.*
