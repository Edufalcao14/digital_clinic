// appointmentsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Appointment } from '@/types/types';

type AppointmentsState = {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  removeAppointment: (id: string) => void;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

// Sample data
const sampleAppointments: Appointment[] = [
  // ... your sampleAppointments data
];

const useAppointmentsStore = create<AppointmentsState>()(
  persist(
    (set) => ({
      appointments: sampleAppointments,

      // Appointment actions
      addAppointment: (appointment) => set((state) => ({
        appointments: [...state.appointments, { ...appointment, id: generateId() }]
      })),
      updateAppointment: (id, appointment) => set((state) => ({
        appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...appointment } : a))
      })),
      removeAppointment: (id) => set((state) => ({
        appointments: state.appointments.filter((a) => a.id !== id)
      })),
    }),
    {
      name: 'appointments-storage', // Key used in localStorage
    }
  )
);

export default useAppointmentsStore;