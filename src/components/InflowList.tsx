'use client';

import React, { useState, useMemo } from 'react';
import { Inflow } from '@/types';
import { Button, Input, Card } from './ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Trash2, Edit2, Calendar, Search, ArrowUpCircle, SearchX } from 'lucide-react';

interface InflowListProps {
    inflows: Inflow[];
    onDelete: (id: string) => void;
    onEdit: (inflow: Inflow) => void;
}

export const InflowList = ({ inflows, onDelete, onEdit }: InflowListProps) => {
    const [search, setSearch] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    const filteredInflows = useMemo(() => {
        return inflows.filter((inf) => {
            const infDate = new Date(inf.date);
            const monthStr = `${infDate.getFullYear()}-${String(infDate.getMonth() + 1).padStart(2, '0')}`;

            const matchesMonth = monthStr === selectedMonth;
            const matchesSearch = inf.description.toLowerCase().includes(search.toLowerCase()) ||
                inf.type.toLowerCase().includes(search.toLowerCase());

            return matchesMonth && matchesSearch;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [inflows, selectedMonth, search]);

    const monthOptions = useMemo(() => {
        const months = new Set<string>();
        // Add current month by default
        const now = new Date();
        months.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);

        inflows.forEach(inf => {
            const d = new Date(inf.date);
            months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        });

        return Array.from(months).sort().reverse();
    }, [inflows]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search inflows..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 min-w-[200px]">
                    <div className="relative flex-1">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                            className="flex h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {monthOptions.map((m) => {
                                const [year, month] = m.split('-');
                                const date = new Date(parseInt(year), parseInt(month) - 1);
                                const label = date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
                                return (
                                    <option key={m} value={m}>
                                        {label}
                                    </option>
                                );
                            })}
                        </select>
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
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredInflows.length > 0 ? (
                                filteredInflows.map((inf) => (
                                    <tr key={inf.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(inf.date)}</td>
                                        <td className="px-6 py-4 font-medium">{inf.description}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                {inf.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-emerald-600">
                                            +{formatCurrency(inf.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onEdit(inf)}>
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => onDelete(inf.id)}>
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
                                            <p>No inflows found for this period</p>
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
