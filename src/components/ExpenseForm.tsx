'use client';

import React, { useState } from 'react';
import { Button, Input, Select } from './ui';
import { Category, Expense } from '@/types';
import { X } from 'lucide-react';

interface ExpenseFormProps {
    onSubmit: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
    onClose: () => void;
    initialData?: Expense;
}

const CATEGORIES: Category[] = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other'];

export const ExpenseForm = ({ onSubmit, onClose, initialData }: ExpenseFormProps) => {
    const [formData, setFormData] = useState({
        amount: initialData?.amount.toString() || '',
        category: initialData?.category || 'Food' as Category,
        description: initialData?.description || '',
        date: initialData?.date.split('T')[0] || new Date().toISOString().split('T')[0],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
            newErrors.amount = 'Valid amount is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!formData.date) {
            newErrors.date = 'Date is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({
                amount: Number(formData.amount),
                category: formData.category,
                description: formData.description,
                date: new Date(formData.date).toISOString(),
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-md rounded-lg shadow-xl border border-border animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">{initialData ? 'Edit Expense' : 'Add Expense'}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Amount</label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className={errors.amount ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        />
                        {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Category</label>
                        <Select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Description</label>
                        <Input
                            placeholder="What was this for?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Date</label>
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className={errors.date ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        />
                        {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            {initialData ? 'Save Changes' : 'Add Expense'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
