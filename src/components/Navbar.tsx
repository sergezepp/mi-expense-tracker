'use client';

import React from 'react';
import { Button } from './ui';
import { Download, Plus, Wallet } from 'lucide-react';
import { exportToCSV } from '@/lib/utils';
import { Expense } from '@/types';

interface NavbarProps {
    expenses: Expense[];
    onAddClick: () => void;
}

export const Navbar = ({ expenses, onAddClick }: NavbarProps) => {
    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
                        <Wallet className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">ExpenseTracer</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportToCSV(expenses)} disabled={expenses.length === 0} className="hidden sm:flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                    <Button size="sm" onClick={onAddClick} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span className="hidden xs:inline">Add Expense</span>
                    </Button>
                </div>
            </div>
        </nav>
    );
};
