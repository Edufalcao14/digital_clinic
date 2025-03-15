// Types
export type Appointment = {
  id: string;
  patientId: string;
  date: Date;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: string;
  notes?: string;
  payment?: Payment;
};

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: {
    allergies: string[];
    medications: string[];
    conditions: string[];
    notes: string;
  };
  dentalHistory?: {
    lastVisit?: Date;
    complaints?: string[];
    treatments?: string[];
  };
  createdAt: Date;
};

export type Payment = {
  id: string;
  patientId: string;
  appointmentId?: string;
  amount: number;
  date: Date;
  method: 'cash' | 'card' | 'insurance' | 'other';
  status: 'paid' | 'pending' | 'overdue';
  description?: string;
};

export type Expense = {
  id: string;
  amount: number;
  date: Date;
  category: string;
  description: string;
  paymentMethod: string;
};

export type Prescription = {
  id: string;
  patientId: string;
  date: Date;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  instructions: string;
  doctorName: string;
  digitalSignature?: string;
};



// Helper function that can be used across stores
export const generateId = () => Math.random().toString(36).substring(2, 9); 