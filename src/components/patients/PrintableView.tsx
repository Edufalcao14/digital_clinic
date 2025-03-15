
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Printer } from 'lucide-react';
import { calculateAge } from '@/utils/ageCalculator';
import { Patient, Appointment, Payment } from '@/store/useAppStore';

interface PrintableViewProps {
  patient: Patient;
  appointments?: Appointment[];
  payments?: Payment[];
  reportType: 'medical' | 'billing';
  onClose: () => void;
}

const PrintableView: React.FC<PrintableViewProps> = ({
  patient,
  appointments = [],
  payments = [],
  reportType,
  onClose
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    // Get the HTML content
    const htmlContent = `
      <html>
        <head>
          <title>Patient Report - ${patient.firstName} ${patient.lastName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              padding: 20px;
            }
            .report-header {
              display: flex;
              justify-content: space-between;
              border-bottom: 2px solid #0ea5e9;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .report-title {
              font-size: 24px;
              font-weight: bold;
              color: #0ea5e9;
            }
            .report-date {
              color: #666;
            }
            .patient-info {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #0284c7;
            }
            .info-row {
              display: flex;
              margin-bottom: 5px;
            }
            .info-label {
              font-weight: bold;
              width: 150px;
            }
            .separator {
              height: 1px;
              background-color: #e2e8f0;
              margin: 15px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background-color: #f1f5f9;
              text-align: left;
              padding: 8px;
              border: 1px solid #e2e8f0;
            }
            td {
              padding: 8px;
              border: 1px solid #e2e8f0;
            }
            .logo {
              font-size: 16px;
              font-weight: bold;
              color: #0ea5e9;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} by Dental Clinic Management System</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      // Close after printing (optional)
      // printWindow.close();
    }, 500);
  };

  const patientAge = patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : 'N/A';

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {reportType === 'medical' ? 'Medical Records' : 'Billing Report'}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
          
          <div ref={printRef}>
            <div className="report-header">
              <div className="logo">Dental Clinic Management System</div>
              <div className="report-date">{new Date().toLocaleDateString()}</div>
            </div>
            
            <div className="patient-info">
              <h3 className="section-title">Patient Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="info-row">
                    <span className="info-label">Name:</span>
                    <span>{patient.firstName} {patient.lastName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Date of Birth:</span>
                    <span>
                      {patient.dateOfBirth 
                        ? new Date(patient.dateOfBirth).toLocaleDateString() 
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Age:</span>
                    <span>{patientAge}</span>
                  </div>
                </div>
                <div>
                  <div className="info-row">
                    <span className="info-label">Phone:</span>
                    <span>{patient.phone || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span>{patient.email || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Patient ID:</span>
                    <span>{patient.id}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="separator" />
            
            {reportType === 'medical' ? (
              <MedicalRecordsContent patient={patient} appointments={appointments} />
            ) : (
              <BillingContent patient={patient} appointments={appointments} payments={payments} />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

interface MedicalRecordsContentProps {
  patient: Patient;
  appointments: Appointment[];
}

const MedicalRecordsContent: React.FC<MedicalRecordsContentProps> = ({ patient, appointments }) => {
  return (
    <div>
      <h3 className="section-title">Medical History</h3>
      <div className="mb-4">
        <div className="info-row">
          <span className="info-label">Allergies:</span>
          <span>{patient.allergies || 'None reported'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Medical Conditions:</span>
          <span>{patient.medicalConditions || 'None reported'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Medications:</span>
          <span>{patient.medications || 'None reported'}</span>
        </div>
      </div>
      
      <Separator className="separator" />
      
      <h3 className="section-title">Treatment History</h3>
      {appointments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Treatment</th>
              <th>Dentist</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{appointment.type}</td>
                <td>{appointment.dentist}</td>
                <td>{appointment.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No treatment records found.</p>
      )}
    </div>
  );
};

interface BillingContentProps {
  patient: Patient;
  appointments: Appointment[];
  payments: Payment[];
}

const BillingContent: React.FC<BillingContentProps> = ({ patient, appointments, payments }) => {
  // Calculate totals
  const totalBilled = appointments.reduce((sum, apt) => {
    // Since 'cost' property doesn't exist on Appointment type, we use a fixed value or determine based on type
    const appointmentCost = getAppointmentCost(apt.type);
    return sum + appointmentCost;
  }, 0);
  
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const balance = totalBilled - totalPaid;
  
  return (
    <div>
      <h3 className="section-title">Billing Summary</h3>
      <div className="mb-4">
        <div className="info-row">
          <span className="info-label">Total Billed:</span>
          <span>${totalBilled.toFixed(2)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Total Paid:</span>
          <span>${totalPaid.toFixed(2)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Balance Due:</span>
          <span className="font-bold">${balance.toFixed(2)}</span>
        </div>
      </div>
      
      <Separator className="separator" />
      
      <h3 className="section-title">Treatment Charges</h3>
      {appointments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Treatment</th>
              <th>Dentist</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{appointment.type}</td>
                <td>{appointment.dentist}</td>
                <td>${getAppointmentCost(appointment.type).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No treatment charges found.</p>
      )}
      
      <Separator className="separator" />
      
      <h3 className="section-title">Payment History</h3>
      {payments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{new Date(payment.date).toLocaleDateString()}</td>
                <td>${payment.amount.toFixed(2)}</td>
                <td>{payment.method}</td>
                <td>{payment.reference || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payment records found.</p>
      )}
    </div>
  );
};

// Utility function to determine appointment cost based on type
const getAppointmentCost = (type: string): number => {
  switch (type) {
    case 'Check-up':
      return 75;
    case 'Cleaning':
      return 120;
    case 'Filling':
      return 200;
    case 'Root Canal':
      return 800;
    case 'Extraction':
      return 250;
    case 'Crown':
      return 900;
    case 'Veneer':
      return 1200;
    default:
      return 150; // Default cost
  }
};

export default PrintableView;
