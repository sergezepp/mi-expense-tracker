import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { Expense } from '../types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

export function formatDate(dateStr: string) {
    return format(new Date(dateStr), 'MMM dd, yyyy');
}

export function exportToCSV(expenses: Expense[]) {
    if (expenses.length === 0) return;

    const headers = ['Date', 'Description', 'Category', 'Amount', 'Created At'];
    const rows = expenses.map((exp) => [
        formatDate(exp.date),
        `"${exp.description}"`,
        exp.category,
        exp.amount.toFixed(2),
        exp.createdAt,
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
