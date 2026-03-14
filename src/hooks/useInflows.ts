'use client';

import { useState, useEffect } from 'react';
import { Inflow } from '../types';
import {
    getInflows,
    addInflowAction,
    deleteInflowAction,
    updateInflowAction
} from '@/lib/actions';

export const useInflows = () => {
    const [inflows, setInflows] = useState<Inflow[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from Server Action on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getInflows();
                setInflows(data);
            } catch (e) {
                console.error('Failed to load inflows from server:', e);
            } finally {
                setIsLoaded(true);
            }
        };
        loadData();
    }, []);

    const addInflow = async (inflow: Omit<Inflow, 'id' | 'createdAt'>) => {
        try {
            const newInflow = await addInflowAction(inflow);
            setInflows((prev) => [newInflow, ...prev]);
            return newInflow;
        } catch (e) {
            console.error('Failed to add inflow:', e);
            throw e;
        }
    };

    const deleteInflow = async (id: string) => {
        try {
            await deleteInflowAction(id);
            setInflows((prev) => prev.filter((inf) => inf.id !== id));
        } catch (e) {
            console.error('Failed to delete inflow:', e);
            throw e;
        }
    };

    const updateInflow = async (id: string, updatedData: Partial<Inflow>) => {
        try {
            await updateInflowAction(id, updatedData);
            setInflows((prev) =>
                prev.map((inf) => (inf.id === id ? { ...inf, ...updatedData } : inf))
            );
        } catch (e) {
            console.error('Failed to update inflow:', e);
            throw e;
        }
    };

    return {
        inflows,
        addInflow,
        deleteInflow,
        updateInflow,
        isLoaded,
    };
};
