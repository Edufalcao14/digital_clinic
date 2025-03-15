import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useAppStore from '@/store/useAppStore';
import { AddAppointmentDialog } from '@/components/appointments/AddAppointmentDialog';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { patients, appointments, payments } = useAppStore();
  const [showAddAppointment, setShowAddAppointment] = useState(false);

  // Calculate metrics
  const totalPatients = patients.length;
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'scheduled' && new Date(apt.date) > new Date()
  ).length;
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const todayAppointments = appointments.filter(
    (apt) => {
      const aptDate = new Date(apt.date);
      const today = new Date();
      return aptDate.getDate() === today.getDate() &&
        aptDate.getMonth() === today.getMonth() &&
        aptDate.getFullYear() === today.getFullYear();
    }
  ).length;

  // Sample data for chart
  const data = [
    { name: 'Mon', appointments: 4, revenue: 450 },
    { name: 'Tue', appointments: 3, revenue: 300 },
    { name: 'Wed', appointments: 5, revenue: 550 },
    { name: 'Thu', appointments: 7, revenue: 700 },
    { name: 'Fri', appointments: 6, revenue: 600 },
    { name: 'Sat', appointments: 2, revenue: 200 },
    { name: 'Sun', appointments: 0, revenue: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className='flex flex-row items-center gap-2'>
          <LayoutDashboard size={32} className='text-dental-600' />
          <h1 className="text-3xl font-bold">Painel de Controle</h1>
        </div>

        <div className="flex justify-end m-5">
          <AddAppointmentDialog />
        </div>
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <DashboardCard
            title="Total de Pacientes"
            value={totalPatients}
            icon={Users}
            trend={{ value: "+5%", label: "em relação ao mês anterior", isPositive: true }}
          />

          <DashboardCard
            title="Próximas Consultas"
            value={upcomingAppointments}
            icon={Calendar}
            additionalInfo={`${todayAppointments} hoje`}
          />

          <DashboardCard
            title="Receita Total"
            value={`R$${totalRevenue}`}
            icon={DollarSign}
            trend={{ value: "+12%", label: "em relação ao mês anterior", isPositive: true }}
          />

          <DashboardCard
            title="Taxa de Sucesso do Tratamento"
            value="95%"
            icon={TrendingUp}
            trend={{ value: "+2%", label: "em relação ao trimestre anterior", isPositive: true }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickFormatter={(value) => `R$${value}`}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'revenue' ? `R$${value}` : value,
                        name === 'revenue' ? 'Receita' : 'Consultas'
                      ]}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="appointments"
                      fill="#38BDF8"
                      name="Consultas"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="revenue"
                      fill="#0EA5E9"
                      name="Receita"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.slice(0, 5).map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patientId);

                  return (
                    <div key={appointment.id} className="flex items-start space-x-4 p-3 rounded-md hover:bg-gray-50">
                      <div className={`p-2 rounded-full ${appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-600' : appointment.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {appointment.status === 'scheduled' ? (
                          <Clock size={18} />
                        ) : appointment.status === 'completed' ? (
                          <CheckCircle size={18} />
                        ) : (
                          <Calendar size={18} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{patient?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
                        </p>
                        <p className="text-xs font-medium text-dental-600 mt-1">
                          {appointment.type}
                        </p>
                      </div>
                      <div className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
                        {appointment.status}
                      </div>
                    </div>
                  );
                })}

                <button
                  className="w-full text-sm text-dental-600 hover:text-dental-700 font-medium mt-2 py-2"
                  onClick={() => navigate('/appointments')}
                >
                  Ver Todos os Agendamentos
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <Card className="card-hover cursor-pointer" onClick={() => navigate('/patients/new')}>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Users className="h-10 w-10 text-dental-500 mb-4" />
              <h3 className="font-medium text-lg">Novo Paciente</h3>
              <p className="text-sm text-muted-foreground mt-1 text-center">
                Registrar um novo paciente
              </p>
            </CardContent>
          </Card>

          <Card
            className="card-hover cursor-pointer"
            onClick={() => setShowAddAppointment(true)}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Calendar className="h-10 w-10 text-dental-500 mb-4" />
              <h3 className="font-medium text-lg">Agendar Consulta</h3>
              <p className="text-sm text-muted-foreground mt-1 text-center">
                Agendar uma nova consulta
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover cursor-pointer" onClick={() => navigate('/prescriptions/new')}>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <FileText className="h-10 w-10 text-dental-500 mb-4" />
              <h3 className="font-medium text-lg">Criar Prescrição</h3>
              <p className="text-sm text-muted-foreground mt-1 text-center">
                Escrever uma nova prescrição
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
