import { Appointment, Appointment as BaseAppointment, Payment } from './types';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';
export type ContactMethod = 'email' | 'phone';


export interface AppointmentWithPatient extends Appointment {
  patientName: string;
  contactMethod: ContactMethod;
  contact: string;
  start: Date; // For calendar display
  end: Date;   // For calendar display
  procedure: string;
  payment: Payment;
}

export interface AppointmentEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: AppointmentWithPatient;
} 