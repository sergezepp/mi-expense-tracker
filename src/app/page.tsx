'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Dashboard } from '@/components/Dashboard';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseForm } from '@/components/ExpenseForm';
import { InflowList } from '@/components/InflowList';
import { InflowForm } from '@/components/InflowForm';
import { useExpenses } from '@/hooks/useExpenses';
import { useInflows } from '@/hooks/useInflows';
import { Expense, Inflow } from '@/types';
import { LayoutDashboard, ListTodo, ArrowUpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const { expenses, addExpense, deleteExpense, updateExpense, isLoaded: isExpensesLoaded } = useExpenses();
  const { inflows, addInflow, deleteInflow, updateInflow, isLoaded: isInflowsLoaded } = useInflows();

  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  const [isInflowFormOpen, setIsInflowFormOpen] = useState(false);
  const [editingInflow, setEditingInflow] = useState<Inflow | undefined>(undefined);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'inflows'>('dashboard');

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseFormOpen(true);
  };

  const handleExpenseSubmit = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
    setEditingExpense(undefined);
  };

  const handleEditInflow = (inflow: Inflow) => {
    setEditingInflow(inflow);
    setIsInflowFormOpen(true);
  };

  const handleInflowSubmit = (data: Omit<Inflow, 'id' | 'createdAt'>) => {
    if (editingInflow) {
      updateInflow(editingInflow.id, data);
    } else {
      addInflow(data);
    }
    setEditingInflow(undefined);
  };

  const isLoaded = isExpensesLoaded && isInflowsLoaded;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse text-sm font-medium">Securing your finances...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar
        expenses={expenses}
        onAddClick={() => {
          setEditingExpense(undefined);
          setIsExpenseFormOpen(true);
        }}
        onInflowClick={() => {
          setEditingInflow(undefined);
          setIsInflowFormOpen(true);
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit mb-8 border border-border">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              activeTab === 'dashboard'
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              activeTab === 'expenses'
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ListTodo className="w-4 h-4" />
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('inflows')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              activeTab === 'inflows'
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowUpCircle className="w-4 h-4 text-emerald-500" />
            Inflows
          </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'dashboard' ? (
            <Dashboard expenses={expenses} inflows={inflows} />
          ) : activeTab === 'expenses' ? (
            <div className="space-y-4">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
                <p className="text-muted-foreground">Manage and track your detailed spending history.</p>
              </div>
              <ExpenseList
                expenses={expenses}
                onDelete={deleteExpense}
                onEdit={handleEditExpense}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold tracking-tight text-emerald-600">Money Inflows</h2>
                <p className="text-muted-foreground">Track your income and other money inflows.</p>
              </div>
              <InflowList
                inflows={inflows}
                onDelete={deleteInflow}
                onEdit={handleEditInflow}
              />
            </div>
          )}
        </div>
      </div>

      {isExpenseFormOpen && (
        <ExpenseForm
          onClose={() => {
            setIsExpenseFormOpen(false);
            setEditingExpense(undefined);
          }}
          onSubmit={handleExpenseSubmit}
          initialData={editingExpense}
        />
      )}

      {isInflowFormOpen && (
        <InflowForm
          onClose={() => {
            setIsInflowFormOpen(false);
            setEditingInflow(undefined);
          }}
          onSubmit={handleInflowSubmit}
          initialData={editingInflow}
        />
      )}
    </main>
  );
}
