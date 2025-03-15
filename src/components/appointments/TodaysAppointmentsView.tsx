import React from 'react';
import { format } from 'date-fns';
import { AppointmentWithPatient } from '@/types/appointment.types';

interface TodaysAppointmentsViewProps {
  appointments: AppointmentWithPatient[];
  onAppointmentClick: (appointment: AppointmentWithPatient) => void;
}

export const TodaysAppointmentsView: React.FC<TodaysAppointmentsViewProps> = ({
  appointments,
  onAppointmentClick,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Consultas de Hoje ({appointments.length})
        </h2>
      </div>

      {appointments.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between py-4 hover:bg-gray-50 cursor-pointer px-4 rounded-lg transition-colors"
              onClick={() => onAppointmentClick(apt)}
            >
              <div className="flex items-center space-x-6">
                <div className="text-lg font-medium text-teal-600">
                  {format(apt.start, 'HH:mm')}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{apt.patientName}</h3>
                  <p className="text-sm text-gray-500">{apt.procedure}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Duração: {apt.duration} min
                </div>
                <div className="px-3 py-1 rounded-full text-sm bg-teal-50 text-teal-700">
                  {apt.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Não há consultas agendadas para hoje</p>
        </div>
      )}
    </div>
  );
}; 