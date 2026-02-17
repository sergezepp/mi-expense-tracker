'use client';

import React, { useMemo } from 'react';
import { Expense, Category } from '@/types';
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
import { TrendingUp, CreditCard, PieChart, Wallet } from 'lucide-react';

interface DashboardProps {
    expenses: Expense[];
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

export const Dashboard = ({ expenses }: DashboardProps) => {
    const stats = useMemo(() => {
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Group by category for chart
        const categoryMap: Record<string, number> = {};
        expenses.forEach((exp) => {
            categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
        });

        const chartData = Object.entries(categoryMap).map(([name, value]) => ({
            name,
            value,
        })).sort((a, b) => b.value - a.value);

        // Get current month spending
        const now = new Date();
        const currentMonthTotal = expenses
            .filter((exp) => {
                const d = new Date(exp.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            })
            .reduce((sum, exp) => sum + exp.amount, 0);

        const topCategory = chartData[0]?.name || 'N/A';

        return { total, currentMonthTotal, topCategory, chartData };
    }, [expenses]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Spending</CardTitle>
                        <Wallet className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Current Month</CardTitle>
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.currentMonthTotal)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Top Category</CardTitle>
                        <PieChart className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.topCategory}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
                        <CreditCard className="w-4 h-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{expenses.length}</div>
                    </CardContent>
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
