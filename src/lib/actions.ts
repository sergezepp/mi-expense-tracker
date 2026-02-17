'use server';

import fs from 'fs/promises';
import path from 'path';
import { Expense } from '@/types';
import { revalidatePath } from 'next/cache';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

// Ensure the data directory and file exist
async function ensureDb() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }

    try {
        await fs.access(DB_PATH);
    } catch {
        await fs.writeFile(DB_PATH, JSON.stringify([], null, 2));
    }
}

export async function getExpenses(): Promise<Expense[]> {
    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as Expense[];
}

export async function addExpenseAction(expense: Omit<Expense, 'id' | 'createdAt'>) {
    await ensureDb();
    const expenses = await getExpenses();
    const newExpense: Expense = {
        ...expense,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };

    const updatedExpenses = [newExpense, ...expenses];
    await fs.writeFile(DB_PATH, JSON.stringify(updatedExpenses, null, 2));
    revalidatePath('/');
    return newExpense;
}

export async function deleteExpenseAction(id: string) {
    await ensureDb();
    const expenses = await getExpenses();
    const updatedExpenses = expenses.filter((exp) => exp.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify(updatedExpenses, null, 2));
    revalidatePath('/');
}

export async function updateExpenseAction(id: string, updatedData: Partial<Expense>) {
    await ensureDb();
    const expenses = await getExpenses();
    const updatedExpenses = expenses.map((exp) =>
        exp.id === id ? { ...exp, ...updatedData } : exp
    );
    await fs.writeFile(DB_PATH, JSON.stringify(updatedExpenses, null, 2));
    revalidatePath('/');
}
