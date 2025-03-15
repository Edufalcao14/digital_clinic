import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PrinterCheck  } from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { calculateAge } from '@/utils/ageCalculator';

// Import components
import PatientHeader from '@/components/patients/PatientHeader';
import ProfileTab from '@/components/patients/ProfileTab';
import OdontogramTab from '@/components/patients/OdontogramTab';
import TreatmentTab from '@/components/patients/TreatmentTab';
import BillingTab from '@/components/patients/BillingTab';
import PrintableView from '@/components/patients/PrintableView';

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { patients, appointments, payments } = useAppStore();
  const [showPrintView, setShowPrintView] = useState(false);
  const [reportType, setReportType] = useState<'medical' | 'billing'>('medical');
  
  // Find the patient by ID
  const patient = patients.find(p => p.id === id);
  
  if (!patient) {
    return <div>Paciente não encontrado</div>;
  }
  
  // Filter appointments and payments for this patient
  const patientAppointments = appointments.filter(apt => apt.patientId === patient.id);
  const patientPayments = payments.filter(payment => payment.patientId === patient.id);
  
  // Calculate total balance due
  const totalBalanceDue = patientAppointments.reduce((sum, apt) => {
    const payment = patientPayments.find(p => p.appointmentId === apt.id);
    // Since 'cost' property doesn't exist on Appointment type, use a fixed value or add it to your data model
    const appointmentCost = 150; // Default cost or you could use apt.type to determine cost
    return sum + (appointmentCost - (payment ? payment.amount : 0));
  }, 0);
  
  // Sample treatment history data
  const treatmentHistory = [
    { id: 1, date: '2023-01-15', procedure: 'Limpeza Dental', dentist: 'Dr. Smith', cost: 120 },
    { id: 2, date: '2023-03-20', procedure: 'Restauração', dentist: 'Dr. Jones', cost: 250 },
    { id: 3, date: '2023-05-10', procedure: 'Canal', dentist: 'Dr. Smith', cost: 800 },
  ];
  
  // Get patient age if date of birth exists
  const patientAge = patient.dateOfBirth 
    ? calculateAge(patient.dateOfBirth.toISOString().split('T')[0]) 
    : 'N/A';
  
  const handlePrintMedical = () => {
    setReportType('medical');
    setShowPrintView(true);
  };
  
  const handlePrintBilling = () => {
    setReportType('billing');
    setShowPrintView(true);
  };
  
  return (
    <div className="dental-container">
      <div className="flex justify-between items-center mb-4">
        <PatientHeader patient={patient} />
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintMedical}>
            <PrinterCheck className="mr-2 h-4 w-4" />
            Relatório Médico
          </Button>
          <Button variant="outline" onClick={handlePrintBilling}>
            <PrinterCheck className="mr-2 h-4 w-4" />
            Relatório Financeiro
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="odontogram">Odontograma</TabsTrigger>
          <TabsTrigger value="treatment">Tratamento</TabsTrigger>
          <TabsTrigger value="billing">Financeiro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileTab patient={patient} patientAge={patientAge} />
        </TabsContent>
        
        <TabsContent value="odontogram">
          <OdontogramTab />
        </TabsContent>
        
        <TabsContent value="treatment" className="space-y-4">
          <TreatmentTab treatmentHistory={treatmentHistory} />
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-4">
          <BillingTab totalBalanceDue={totalBalanceDue} patientPayments={patientPayments} />
        </TabsContent>
      </Tabs>
      
      {showPrintView && (
        <PrintableView
          patient={patient}
          appointments={patientAppointments}
          payments={patientPayments}
          reportType={reportType}
          onClose={() => setShowPrintView(false)}
        />
      )}
    </div>
  );
};

export default PatientDetail;
