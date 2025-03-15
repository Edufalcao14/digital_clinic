import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/types/types';

interface MedicalHistoryCardProps {
  patient: Patient;
}

const MedicalHistoryCard: React.FC<MedicalHistoryCardProps> = ({ patient }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical History</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add your medical history content here */}
        {/* Example: */}
        <div className="space-y-2">
          <p><strong>Allergies:</strong> {patient.medicalHistory?.allergies.join(', ') || 'None'}</p>
          <p><strong>Medical Conditions:</strong> {patient.medicalHistory?.conditions.join(', ') || 'None'}</p>
          <p><strong>Current Medications:</strong> {patient.medicalHistory?.medications.join(', ') || 'None'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalHistoryCard; 