// paymentsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Payment } from '@/types/types';

type PaymentsState = {
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  removePayment: (id: string) => void;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

// Sample data
const samplePayments: Payment[] = [
  // ... your samplePayments data
];

const usePaymentsStore = create<PaymentsState>()(
  persist(
    (set) => ({
      payments: samplePayments,

      // Payment actions
      addPayment: (payment) => set((state) => ({
        payments: [...state.payments, { ...payment, id: generateId() }]
      })),
      updatePayment: (id, payment) => set((state) => ({
        payments: state.payments.map((p) => (p.id === id ? { ...p, ...payment } : p))
      })),
      removePayment: (id) => set((state) => ({
        payments: state.payments.filter((p) => p.id !== id)
      })),
    }),
    {
      name: 'payments-storage', // Key used in localStorage
    }
  )
);

export default usePaymentsStore;