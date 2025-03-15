import React from 'react';
import { User, Phone, Mail } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Patient } from '@/store/useAppStore';
import { Clipboard, Pill } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MedicalHistoryCard from '@/components/patients/MedicalHistoryCard';

interface ProfileTabProps {
  patient: Patient;
  patientAge: string | number;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ patient, patientAge }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Paciente</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{patient.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{patient.name}</p>
              <p className="text-muted-foreground">{patient.email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>{patientAge} anos</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{patient.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <MedicalHistoryCard patient={patient} />
    </div>
  );
};

export default ProfileTab;
