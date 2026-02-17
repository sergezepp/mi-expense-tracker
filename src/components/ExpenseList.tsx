'use client';

import React, { useState } from 'react';
import { Expense, Category } from '@/types';
import { Button, Input, Select, Card } from './ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, Filter, Trash2, Edit2, SearchX } from 'lucide-react';

interface ExpenseListProps {
    expenses: Expense[];
    onDelete: (id: string) => void;
    onEdit: (expense: Expense) => void;
}

export const ExpenseList = ({ expenses, onDelete, onEdit }: ExpenseListProps) => {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');

    const filteredExpenses = expenses.filter((exp) => {
        const matchesSearch = exp.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || exp.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search expenses..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 min-w-[200px]">
                    <div className="relative flex-1">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Select
                            className="pl-9"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value as Category | 'All')}
                        >
                            <option value="All">All Categories</option>
                            <option value="Food">Food</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Bills">Bills</option>
                            <option value="Health">Health</option>
                            <option value="Other">Other</option>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredExpenses.length > 0 ? (
                                filteredExpenses.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(exp.date)}</td>
                                        <td className="px-6 py-4 font-medium">{exp.description}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                {exp.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                                            {formatCurrency(exp.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onEdit(exp)}>
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => onDelete(exp.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <SearchX className="w-8 h-8 opacity-20" />
                                            <p>No expenses found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
