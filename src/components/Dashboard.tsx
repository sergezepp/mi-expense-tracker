'use client';

import React, { useMemo } from 'react';
import { Expense, Category, Inflow } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from './ui';
import { formatCurrency } from '@/lib/utils';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { TrendingUp, CreditCard, PieChart, Wallet, ArrowUpCircle, TrendingDown, Target } from 'lucide-react';

interface DashboardProps {
    expenses: Expense[];
    inflows: Inflow[];
}

const COLORS = [
    '#10b981', // Emerald-500
    '#059669', // Emerald-600
    '#34d399', // Emerald-400
    '#10b981', // Emerald-500
    '#059669', // Emerald-600
    '#34d399', // Emerald-400
    '#047857', // Emerald-700
];

export const Dashboard = ({ expenses, inflows }: DashboardProps) => {
    const stats = useMemo(() => {
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalInflows = inflows.reduce((sum, inf) => sum + inf.amount, 0);

        // Group by category for chart
        const categoryMap: Record<string, number> = {};
        expenses.forEach((exp) => {
            categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
        });

        const chartData = Object.entries(categoryMap).map(([name, value]) => ({
            name,
            value,
        })).sort((a, b) => b.value - a.value);

        // Get current month stats
        const now = new Date();
        const currentMonthExpenses = expenses
            .filter((exp) => {
                const d = new Date(exp.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            })
            .reduce((sum, exp) => sum + exp.amount, 0);

        const currentMonthInflows = inflows
            .filter((inf) => {
                const d = new Date(inf.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            })
            .reduce((sum, inf) => sum + inf.amount, 0);

        const topCategory = chartData[0]?.name || 'N/A';

        return {
            totalExpenses,
            totalInflows,
            currentMonthExpenses,
            currentMonthInflows,
            topCategory,
            chartData
        };
    }, [expenses, inflows]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <Card className="border-l-4 border-l-primary/50 bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
                        <Wallet className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalInflows - stats.totalExpenses)}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500/50 bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">All-time Inflow</CardTitle>
                        <ArrowUpCircle className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">+{formatCurrency(stats.totalInflows)}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500/50 bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">All-time Expense</CardTitle>
                        <TrendingDown className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">-{formatCurrency(stats.totalExpenses)}</div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Top spending</CardTitle>
                        <PieChart className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.topCategory}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Recap Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <Card className="bg-emerald-50/50 border-emerald-100 flex items-center p-6 gap-4">
                    <div className="bg-emerald-500 p-3 rounded-full text-white shadow-lg shadow-emerald-200">
                        <ArrowUpCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-emerald-600">Total Inflow (Month)</p>
                        <p className="text-2xl font-bold text-emerald-700">{formatCurrency(stats.currentMonthInflows)}</p>
                    </div>
                </Card>

                <Card className="bg-red-50/50 border-red-100 flex items-center p-6 gap-4">
                    <div className="bg-red-500 p-3 rounded-full text-white shadow-lg shadow-red-200">
                        <TrendingDown className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-red-600">Total Expense (Month)</p>
                        <p className="text-2xl font-bold text-red-700">{formatCurrency(stats.currentMonthExpenses)}</p>
                    </div>
                </Card>

                <Card className="bg-primary/5 border-primary/10 flex items-center p-6 gap-4">
                    <div className="bg-primary p-3 rounded-full text-white shadow-lg shadow-primary/20">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-primary">Monthly Net</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(stats.currentMonthInflows - stats.currentMonthExpenses)}</p>
                    </div>
                </Card>
            </div>

            <Card className="p-6">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold">Spending by Category</h3>
                    <p className="text-sm text-muted-foreground">Overview of your expenses across different categories</p>
                </div>
                <div className="h-[300px] w-full">
                    {stats.chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.chartData} layout="vertical" margin={{ left: 40, right: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={100}
                                />
                                <Tooltip
                                    formatter={(value: any) => formatCurrency(Number(value))}
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                    {stats.chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            Add some expenses to see your spending patterns
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
