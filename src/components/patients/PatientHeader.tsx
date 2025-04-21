import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types/types';

interface PatientHeaderProps {
  patient: Patient;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="page-title">{patient.name}</h1>
        <p className="text-muted-foreground">
          <Calendar className="mr-2 inline-block h-4 w-4" />
          Última visita: {patient.dentalHistory?.lastVisit ? new Date(patient.dentalHistory.lastVisit).toLocaleDateString('pt-BR') : 'Nenhuma visita registrada'}
        </p>
      </div>
    </div>
  );
};

export default PatientHeader;
