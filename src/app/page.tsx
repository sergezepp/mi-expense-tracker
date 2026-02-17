'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Dashboard } from '@/components/Dashboard';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseForm } from '@/components/ExpenseForm';
import { useExpenses } from '@/hooks/useExpenses';
import { Expense } from '@/types';
import { LayoutDashboard, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const { expenses, addExpense, deleteExpense, updateExpense, isLoaded } = useExpenses();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list'>('dashboard');

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
    setEditingExpense(undefined);
  };

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
    <main className="min-h-screen bg-background">
      <Navbar
        expenses={expenses}
        onAddClick={() => {
          setEditingExpense(undefined);
          setIsFormOpen(true);
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
            onClick={() => setActiveTab('list')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              activeTab === 'list'
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ListTodo className="w-4 h-4" />
            Transactions
          </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'dashboard' ? (
            <Dashboard expenses={expenses} />
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
                <p className="text-muted-foreground">Manage and track your detailed spending history.</p>
              </div>
              <ExpenseList
                expenses={expenses}
                onDelete={deleteExpense}
                onEdit={handleEdit}
              />
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <ExpenseForm
          onClose={() => {
            setIsFormOpen(false);
            setEditingExpense(undefined);
          }}
          onSubmit={handleSubmit}
          initialData={editingExpense}
        />
      )}
    </main>
  );
}
