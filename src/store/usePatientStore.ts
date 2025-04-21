// patientsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Patient } from '@/types/types';

type PatientsState = {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  removePatient: (id: string) => void;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

// Sample data
const samplePatients: Patient[] = [
  // ... your samplePatients data
];

const usePatientsStore = create<PatientsState>()(
  persist(
    (set) => ({
      patients: samplePatients,

      // Patient actions
      addPatient: (patient) => set((state) => ({
        patients: [...state.patients, { ...patient, id: generateId(), createdAt: new Date() }]
      })),
      updatePatient: (id, patient) => set((state) => ({
        patients: state.patients.map((p) => (p.id === id ? { ...p, ...patient } : p))
      })),
      removePatient: (id) => set((state) => ({
        patients: state.patients.filter((p) => p.id !== id)
      })),
    }),
    {
      name: 'patients-storage', // Key used in localStorage
    }
  )
);

export default usePatientsStore;