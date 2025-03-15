import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br'; // Import Portuguese Brazil locale
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Import date-fns Portuguese Brazil locale
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { AppointmentWithPatient, AppointmentEvent } from '@/types/appointment.types';

// Set moment locale to Portuguese Brazil
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  appointments: AppointmentWithPatient[];
  date: Date;
  onDateChange: (date: Date) => void;
  onAppointmentClick: (appointment: AppointmentWithPatient) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  date,
  onDateChange,
  onAppointmentClick,
}) => {
  const events: AppointmentEvent[] = appointments.map(appointment => ({
    id: appointment.id,
    title: `${appointment.patientName} - ${appointment.type}`,
    start: appointment.start,
    end: appointment.end,
    resource: appointment
  }));

  const getStatusStyles = (status: AppointmentWithPatient['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-600';
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      case 'no-show':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getCalendarEventStyle = (status: AppointmentWithPatient['status']) => {
    switch (status) {
      case 'scheduled':
        return '#4f46e5';
      case 'completed':
        return '#059669';
      case 'cancelled':
        return '#dc2626';
      case 'no-show':
        return '#ea580c';
      default:
        return '#6b7280';
    }
  };

  const StatusIcon = ({ status }: { status: AppointmentWithPatient['status'] }) => {
    switch (status) {
      case 'scheduled':
        return <Clock size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'cancelled':
      case 'no-show':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-white border-b border-gray-100 px-6">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Calendário de Consultas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="h-[400px] md:h-[600px]">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectEvent={(event) => onAppointmentClick(event.resource)}
                date={date}
                onNavigate={(newDate) => onDateChange(newDate)}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: getCalendarEventStyle(event.resource.status),
                    borderRadius: '6px',
                    color: 'white',
                    border: 'none',
                    padding: '2px 6px'
                  }
                })}
                views={['month', 'week', 'day']}
                defaultView="month"
                className="rounded-lg"
                messages={{
                  today: 'Hoje',
                  previous: 'Anterior',
                  next: 'Próximo',
                  month: 'Mês',
                  week: 'Semana',
                  day: 'Dia',
                  agenda: 'Agenda',
                  date: 'Data',
                  time: 'Hora',
                  event: 'Evento',
                  noEventsInRange: 'Não há consultas neste período',
                  showMore: (total) => `+ Ver mais (${total})`
                }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Appointments */}
      <Card className="mt-6 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Consultas de {format(date, 'd MMMM yyyy', { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments
              .filter(apt => format(apt.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
              .length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Não há consultas agendadas para este dia.
              </div>
            ) : (
              appointments
                .filter(apt => format(apt.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
                .map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-lg bg-white border border-gray-100 shadow-sm cursor-pointer"
                    onClick={() => onAppointmentClick(appointment)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${getStatusStyles(appointment.status)}`}>
                        <StatusIcon status={appointment.status} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">{appointment.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {format(appointment.start, 'HH:mm', { locale: ptBR })}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.contactMethod}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};