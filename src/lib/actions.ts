'use server';

import fs from 'fs/promises';
import path from 'path';
import { Expense, Inflow } from '@/types';
import { revalidatePath } from 'next/cache';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const INFLOWS_DB_PATH = path.join(DATA_DIR, 'inflows.json');

// Ensure the data directory and file exist
async function ensureDb(filePath: string) {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }

    try {
        await fs.access(filePath);
    } catch {
        await fs.writeFile(filePath, JSON.stringify([], null, 2));
    }
}

export async function getExpenses(): Promise<Expense[]> {
    await ensureDb(DB_PATH);
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as Expense[];
}

export async function addExpenseAction(expense: Omit<Expense, 'id' | 'createdAt'>) {
    await ensureDb(DB_PATH);
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
    await ensureDb(DB_PATH);
    const expenses = await getExpenses();
    const updatedExpenses = expenses.filter((exp) => exp.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify(updatedExpenses, null, 2));
    revalidatePath('/');
}

export async function updateExpenseAction(id: string, updatedData: Partial<Expense>) {
    await ensureDb(DB_PATH);
    const expenses = await getExpenses();
    const updatedExpenses = expenses.map((exp) =>
        exp.id === id ? { ...exp, ...updatedData } : exp
    );
    await fs.writeFile(DB_PATH, JSON.stringify(updatedExpenses, null, 2));
    revalidatePath('/');
}

// Inflow Actions
export async function getInflows(): Promise<Inflow[]> {
    await ensureDb(INFLOWS_DB_PATH);
    const data = await fs.readFile(INFLOWS_DB_PATH, 'utf-8');
    return JSON.parse(data) as Inflow[];
}

export async function addInflowAction(inflow: Omit<Inflow, 'id' | 'createdAt'>) {
    await ensureDb(INFLOWS_DB_PATH);
    const inflows = await getInflows();
    const newInflow: Inflow = {
        ...inflow,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };

    const updatedInflows = [newInflow, ...inflows];
    await fs.writeFile(INFLOWS_DB_PATH, JSON.stringify(updatedInflows, null, 2));
    revalidatePath('/');
    return newInflow;
}

export async function deleteInflowAction(id: string) {
    await ensureDb(INFLOWS_DB_PATH);
    const inflows = await getInflows();
    const updatedInflows = inflows.filter((inf) => inf.id !== id);
    await fs.writeFile(INFLOWS_DB_PATH, JSON.stringify(updatedInflows, null, 2));
    revalidatePath('/');
}

export async function updateInflowAction(id: string, updatedData: Partial<Inflow>) {
    await ensureDb(INFLOWS_DB_PATH);
    const inflows = await getInflows();
    const updatedInflows = inflows.map((inf) =>
        inf.id === id ? { ...inf, ...updatedData } : inf
    );
    await fs.writeFile(INFLOWS_DB_PATH, JSON.stringify(updatedInflows, null, 2));
    revalidatePath('/');
}
