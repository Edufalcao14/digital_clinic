import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet, ChevronLeft } from 'lucide-react';
import { calculateAge } from '@/utils/ageCalculator';

// Import components
import PatientHeader from '@/components/patients/PatientHeader';
import ProfileTab from '@/components/patients/ProfileTab';
import OdontogramTab from '@/components/patients/OdontogramTab';
import TreatmentTab from '@/components/patients/TreatmentTab';
import BillingTab from '@/components/patients/BillingTab';
import PrintableView from '@/components/patients/PrintableView';
import usePatientsStore from '@/store/usePatientStore';
import useAppointmentsStore from '@/store/useAppointmentsStore';
import usePaymentsStore from '@/store/usePayments';

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const patients = usePatientsStore((state) => state.patients);
  const appointments = useAppointmentsStore((state) => state.appointments);
  const payments = usePaymentsStore((state) => state.payments);
  const [showPrintView, setShowPrintView] = useState(false);
  const [reportType, setReportType] = useState<'medical' | 'billing'>('medical');
  
  // Find the patient by ID
  const patient = patients.find(p => p.id === id);
  
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-rose-400">
        <div className="text-lg font-light mb-2">Paciente não encontrado</div>
        <Button variant="ghost" className="text-rose-400 flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Voltar
        </Button>
      </div>
    );
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
    ? calculateAge(patient.dateOfBirth) 
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
    <div className="p-6 bg-gradient-to-br from-white to-rose-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <PatientHeader patient={patient} />
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handlePrintMedical} 
              className="bg-white text-rose-600 border-rose-200 hover:bg-rose-50 transition-colors"
            >
              <FileText className="mr-2 h-4 w-4" />
              Relatório Médico
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrintBilling}
              className="bg-white text-violet-600 border-violet-200 hover:bg-violet-50 transition-colors"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Relatório Financeiro
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-gray-50 p-1 rounded-lg">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-white data-[state=active]:text-rose-600 rounded-md px-6"
              >
                Perfil
              </TabsTrigger>
              <TabsTrigger 
                value="odontogram" 
                className="data-[state=active]:bg-white data-[state=active]:text-rose-600 rounded-md px-6"
              >
                Odontograma
              </TabsTrigger>
              <TabsTrigger 
                value="treatment" 
                className="data-[state=active]:bg-white data-[state=active]:text-rose-600 rounded-md px-6"
              >
                Tratamento
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="data-[state=active]:bg-white data-[state=active]:text-rose-600 rounded-md px-6"
              >
                Financeiro
              </TabsTrigger>
            </TabsList>
            
            <TabsContent 
              value="profile" 
              className="bg-white rounded-lg p-1 animate-in fade-in-50 duration-300"
            >
              <ProfileTab patient={patient} patientAge={patientAge} />
            </TabsContent>
            
            <TabsContent 
              value="odontogram" 
              className="bg-white rounded-lg p-1 animate-in fade-in-50 duration-300"
            >
              <OdontogramTab />
            </TabsContent>
            
            <TabsContent 
              value="treatment" 
              className="bg-white rounded-lg p-1 animate-in fade-in-50 duration-300"
            >
              <TreatmentTab treatmentHistory={treatmentHistory} />
            </TabsContent>
            
            <TabsContent 
              value="billing"
              className="bg-white rounded-lg p-1 animate-in fade-in-50 duration-300"
            >
              <BillingTab totalBalanceDue={totalBalanceDue} patientPayments={patientPayments} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          Sistema Odontológico • {new Date().toLocaleDateString()}
        </div>
      </div>
      
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