'use client';

import { useState, useEffect } from 'react';
import { Expense, Category } from '../types';

export const useExpenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('expenses');
        if (saved) {
            try {
                setExpenses(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse expenses:', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage when expenses change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('expenses', JSON.stringify(expenses));
        }
    }, [expenses, isLoaded]);

    const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
        const newExpense: Expense = {
            ...expense,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        setExpenses((prev) => [newExpense, ...prev]);
    };

    const deleteExpense = (id: string) => {
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    };

    const updateExpense = (id: string, updatedData: Partial<Expense>) => {
        setExpenses((prev) =>
            prev.map((exp) => (exp.id === id ? { ...exp, ...updatedData } : exp))
        );
    };

    return {
        expenses,
        addExpense,
        deleteExpense,
        updateExpense,
        isLoaded,
    };
};
