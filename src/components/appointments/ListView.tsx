import React from 'react';
import { motion } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import { Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppointmentWithPatient } from '@/types/appointment.types';

interface ListViewProps {
  appointments: AppointmentWithPatient[];
  onAppointmentClick: (appointment: AppointmentWithPatient) => void;
}

const statusStyles = {
  scheduled: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
    icon: Clock,
  },
  completed: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-100',
    icon: CheckCircle,
  },
  cancelled: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-100',
    icon: XCircle,
  },
  'no-show': {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
    icon: XCircle,
  },
};

export const ListView: React.FC<ListViewProps> = ({ appointments, onAppointmentClick }) => {
  // Group appointments by date
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const date = format(appointment.start, 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, AppointmentWithPatient[]>);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-0">
      {Object.entries(groupedAppointments)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, dayAppointments]) => (
          <div key={date} className="mb-6">
            {/* Date Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {format(new Date(date), 'EEEE, MMMM d')}
              </h2>
              <div className="h-px bg-gray-100 mt-2" />
            </motion.div>

            {/* Appointments List */}
            <div className="space-y-3">
              {dayAppointments.map((appointment) => {
                const status = statusStyles[appointment.status];
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={appointment.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "bg-white rounded-lg border p-4 cursor-pointer",
                      "transition-all duration-200 hover:shadow-lg",
                      status.border
                    )}
                    onClick={() => onAppointmentClick(appointment)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Status Indicator */}
                      <div
                        className={cn(
                          "p-2 rounded-full shrink-0",
                          status.bg
                        )}
                      >
                        <StatusIcon size={18} className={status.text} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-medium text-gray-900 truncate">
                            {appointment.patientName}
                          </h3>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {appointment.type}
                        </p>
                        
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span className="text-gray-500">
                            {format(appointment.start, 'h:mm a')}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500 truncate">
                            {appointment.contactMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
};