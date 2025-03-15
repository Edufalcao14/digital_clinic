import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  List,

  Calendar as CalendarIcon,
} from 'lucide-react';
import { FaTooth } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import { format, addMinutes } from 'date-fns';
import { ListView } from '@/components/appointments/ListView';
import { CalendarView } from '@/components/appointments/CalendarView';
import { AppointmentWithPatient } from '@/types/appointment.types';
import { AddAppointmentDialog } from '@/components/appointments/AddAppointmentDialog';
import useAppStore from '@/store/useAppStore';
import { TodaysAppointmentsView } from '@/components/appointments/TodaysAppointmentsView';
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<'list' | 'calendar' | 'today'>('calendar');
  const { appointments, patients } = useAppStore();
  const navigate = useNavigate();
  const [showTodaysAppointments, setShowTodaysAppointments] = useState(false);

  const appointmentsWithPatients = useMemo(() => {
    return appointments.map(appointment => {
      const patient = patients.find(p => p.id === appointment.patientId);
      if (!patient) return null;

      const start = new Date(appointment.date);
      start.setHours(parseInt(appointment.time.split(':')[0]), parseInt(appointment.time.split(':')[1]));
      const end = addMinutes(start, appointment.duration);

      return {
        ...appointment,
        patientName: patient.name,
        contactMethod: patient.phone ? 'phone' : 'email',
        contact: patient.phone || patient.email,
        start,
        end,
      } as AppointmentWithPatient;
    }).filter((apt): apt is AppointmentWithPatient => apt !== null);
  }, [appointments, patients]);

  const todaysAppointments = useMemo(() => {
    const today = new Date();
    return appointmentsWithPatients.filter(apt => 
      apt.start.toDateString() === today.toDateString() && 
      apt.status === 'scheduled'
    );
  }, [appointmentsWithPatients]);

  const handleAppointmentClick = (appointment: AppointmentWithPatient) => {
    navigate(`/appointments/${appointment.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3">
              <FaTooth className="w-8 h-8 text-teal-600" />
              <h1 className="text-2xl font-semibold text-gray-800">
                Agendamentos Odontológicos
              </h1>
            </div>
            
            <div className="flex items-center flex-col-reverse sm:flex-row gap-2">
              <div className="flex flex-row bg-white p-1 rounded-lg shadow-sm border border-gray-100">
                <Button
                  variant={view === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('list')}
                  className={view === 'list' ? 'bg-teal-50 text-teal-700' : 'text-gray-600'}
                >
                  <List className="w-4 h-4 mr-2" />
                  Lista
                </Button>
                <Button
                  variant={view === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('calendar')}
                  className={view === 'calendar' ? 'bg-teal-50 text-teal-700' : 'text-gray-600'}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Calendário
                </Button>
                <Button
                  variant={view === 'today' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('today')}
                  className={view === 'today' ? 'bg-teal-50 text-teal-700' : 'text-gray-600'}
                >
                  Hoje ({todaysAppointments.length})
                </Button>
              </div>
              <AddAppointmentDialog />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {view === 'calendar' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CalendarView
                appointments={appointmentsWithPatients}
                date={date}
                onDateChange={setDate}
                onAppointmentClick={handleAppointmentClick}
              />
            </motion.div>
          )}

          {view === 'list' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ListView
                appointments={appointmentsWithPatients}
                onAppointmentClick={handleAppointmentClick}
              />
            </motion.div>
          )}

          {view === 'today' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <TodaysAppointmentsView
                appointments={todaysAppointments}
                onAppointmentClick={handleAppointmentClick}
              />
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Appointments;