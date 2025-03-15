
import { Patient , Appointment, Expense, Payment, Prescription } from '@/types/types';
import { create } from 'zustand';



type AppState = {
  patients: Patient[];
  appointments: Appointment[];
  payments: Payment[];
  expenses: Expense[];
  prescriptions: Prescription[];
  // Actions
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  removePatient: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  removeAppointment: (id: string) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  removePayment: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  addPrescription: (prescription: Omit<Prescription, 'id'>) => void;
  updatePrescription: (id: string, prescription: Partial<Prescription>) => void;
  removePrescription: (id: string) => void;
};

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Sample data for testing
const samplePatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-123-4567',
    dateOfBirth: new Date('1985-05-15'),
    address: '123 Main St, Anytown',
    medicalHistory: {
      allergies: ['Penicillin'],
      medications: ['Lisinopril'],
      conditions: ['Hypertension'],
      notes: 'Patient has dental anxiety',
    },
    dentalHistory: {
      lastVisit: new Date('2023-01-10'),
      complaints: ['Sensitivity to cold'],
      treatments: ['Cleaning', 'Filling'],
    },
    createdAt: new Date('2022-10-05'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-987-6543',
    dateOfBirth: new Date('1990-08-20'),
    address: '456 Oak Ave, Somewhere',
    medicalHistory: {
      allergies: [],
      medications: [],
      conditions: [],
      notes: 'No significant medical history',
    },
    dentalHistory: {
      lastVisit: new Date('2023-02-22'),
      complaints: ['Bleeding gums'],
      treatments: ['Deep cleaning'],
    },
    createdAt: new Date('2022-11-15'),
  },
];

const sampleAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    date: new Date('2023-07-15'),
    time: '10:00',
    duration: 60,
    status: 'completed',
    type: 'Cleaning',
    notes: 'Regular checkup',
  },
  {
    id: '2',
    patientId: '2',
    date: new Date('2023-07-20'),
    time: '14:30',
    duration: 45,
    status: 'scheduled',
    type: 'Consultation',
    notes: 'New patient consultation',
  },
  {
    id: '3',
    patientId: '1',
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    time: '09:15',
    duration: 90,
    status: 'scheduled',
    type: 'Root Canal',
    notes: 'Follow-up treatment',
  },
];

const samplePayments: Payment[] = [
  {
    id: '1',
    patientId: '1',
    appointmentId: '1',
    amount: 150,
    date: new Date('2023-07-15'),
    method: 'card',
    status: 'paid',
    description: 'Payment for cleaning',
  },
  {
    id: '2',
    patientId: '2',
    appointmentId: '2',
    amount: 75,
    date: new Date('2023-07-20'),
    method: 'cash',
    status: 'paid',
    description: 'Partial payment for consultation',
  },
];

const useAppStore = create<AppState>((set) => ({
  patients: samplePatients,
  appointments: sampleAppointments,
  payments: samplePayments,
  expenses: [],
  prescriptions: [],
  
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
}));

export default useAppStore;
