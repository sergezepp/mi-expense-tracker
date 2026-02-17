'use client';

import { useState, useEffect } from 'react';
import { Expense } from '../types';
import {
    getExpenses,
    addExpenseAction,
    deleteExpenseAction,
    updateExpenseAction
} from '@/lib/actions';

export const useExpenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from Server Action on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getExpenses();
                setExpenses(data);
            } catch (e) {
                console.error('Failed to load expenses from server:', e);
            } finally {
                setIsLoaded(true);
            }
        };
        loadData();
    }, []);

    const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
        try {
            const newExpense = await addExpenseAction(expense);
            setExpenses((prev) => [newExpense, ...prev]);
        } catch (e) {
            console.error('Failed to add expense:', e);
        }
    };

    const deleteExpense = async (id: string) => {
        try {
            await deleteExpenseAction(id);
            setExpenses((prev) => prev.filter((exp) => exp.id !== id));
        } catch (e) {
            console.error('Failed to delete expense:', e);
        }
    };

    const updateExpense = async (id: string, updatedData: Partial<Expense>) => {
        try {
            await updateExpenseAction(id, updatedData);
            setExpenses((prev) =>
                prev.map((exp) => (exp.id === id ? { ...exp, ...updatedData } : exp))
            );
        } catch (e) {
            console.error('Failed to update expense:', e);
        }
    };

    return {
        expenses,
        addExpense,
        deleteExpense,
        updateExpense,
        isLoaded,
    };
};
