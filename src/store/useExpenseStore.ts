// expensesStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Expense } from '@/types/types';

type ExpensesState = {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const useExpensesStore = create<ExpensesState>()(
  persist(
    (set) => ({
      expenses: [],

      // Expense actions
      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: generateId() }]
      })),
      updateExpense: (id, expense) => set((state) => ({
        expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...expense } : e))
      })),
      removeExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id)
      })),
    }),
    {
      name: 'expenses-storage', // Key used in localStorage
    }
  )
);

export default useExpensesStore;