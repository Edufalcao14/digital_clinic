// prescriptionsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Prescription } from '@/types/types';

type PrescriptionsState = {
  prescriptions: Prescription[];
  addPrescription: (prescription: Omit<Prescription, 'id'>) => void;
  updatePrescription: (id: string, prescription: Partial<Prescription>) => void;
  removePrescription: (id: string) => void;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const usePrescriptionsStore = create<PrescriptionsState>()(
  persist(
    (set) => ({
      prescriptions: [],

      // Prescription actions
      addPrescription: (prescription) => set((state) => ({
        prescriptions: [...state.prescriptions, { ...prescription, id: generateId() }]
      })),
      updatePrescription: (id, prescription) => set((state) => ({
        prescriptions: state.prescriptions.map((p) => (p.id === id ? { ...p, ...prescription } : p))
      })),
      removePrescription: (id) => set((state) => ({
        prescriptions: state.prescriptions.filter((p) => p.id !== id)
      })),
    }),
    {
      name: 'prescriptions-storage', // Key used in localStorage
    }
  )
);

export default usePrescriptionsStore;