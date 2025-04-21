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
  LayoutDashboard,
  Plus,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AddAppointmentDialog } from '@/components/appointments/AddAppointmentDialog';
import usePatientsStore from '@/store/usePatientStore';
import useAppointmentsStore from '@/store/useAppointmentsStore';
import usePaymentsStore from '@/store/usePayments';

const Dashboard = () => {
  const navigate = useNavigate();
  const patients = usePatientsStore((state) => state.patients);
  const appointments = useAppointmentsStore((state) => state.appointments);
  const payments = usePaymentsStore((state) => state.payments);
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

  // Sample data for charts
  const weeklyData = [
    { name: 'Seg', appointments: 4, revenue: 450 },
    { name: 'Ter', appointments: 3, revenue: 300 },
    { name: 'Qua', appointments: 5, revenue: 550 },
    { name: 'Qui', appointments: 7, revenue: 700 },
    { name: 'Sex', appointments: 6, revenue: 600 },
    { name: 'Sáb', appointments: 2, revenue: 200 },
    { name: 'Dom', appointments: 0, revenue: 0 },
  ];

  const treatmentData = [
    { name: 'Limpeza', value: 35 },
    { name: 'Restauração', value: 25 },
    { name: 'Canal', value: 15 },
    { name: 'Ortodontia', value: 20 },
    { name: 'Outros', value: 5 },
  ];

  const COLORS = ['#e879f9', '#f472b6', '#fb7185', '#c084fc', '#a78bfa'];

  // Quick action cards
  const quickActions = [
    {
      title: "Novo Paciente",
      icon: Users,
      color: "violet",
      description: "Registrar um novo paciente",
      action: () => navigate('/patients/new')
    },
    {
      title: "Agendar Consulta",
      icon: Calendar,
      color: "pink",
      description: "Agendar uma nova consulta",
      action: () => setShowAddAppointment(true)
    },
    {
      title: "Criar Prescrição",
      icon: FileText,
      color: "teal",
      description: "Escrever uma nova prescrição",
      action: () => navigate('/prescriptions/new')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-rose-50/50 overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-100 px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-10 overflow-x-hidden">
        <div className="flex items-center gap-3">
          <div className="bg-pink-100 p-2 rounded-lg">
            <LayoutDashboard size={22} className="text-pink-500" />
          </div>
          <div>
            <h1 className="text-xl font-medium text-gray-800">Painel de Controle</h1>
            <p className="text-sm text-gray-500">Bem-vinda, Dra. Jéssica de Carvalho</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <AddAppointmentDialog />
          {/* Profile dropdown would go here */}
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-full overflow-x-hidden">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatsCard
            title="Total de Pacientes"
            value={totalPatients}
            icon={Users}
            iconBg="bg-violet-100"
            iconColor="text-violet-500"
            trend="+5%"
            trendUp={true}
            subtext=""
          />
          <StatsCard
            title="Consultas Hoje"
            value={todayAppointments}
            icon={Calendar}
            iconBg="bg-pink-100"
            iconColor="text-pink-500"
            subtext={`${upcomingAppointments} agendadas`}
            trend=""
            trendUp={false}
          />
          <StatsCard
            title="Receita Total"
            value={`R$${totalRevenue}`}
            icon={DollarSign}
            iconBg="bg-teal-100"
            iconColor="text-teal-500"
            trend="+12%"
            trendUp={true}
            subtext=""
          />
          <StatsCard
            title="Taxa de Sucesso"
            value="95%"
            icon={TrendingUp}
            iconBg="bg-rose-100"
            iconColor="text-rose-500"
            trend="+2%"
            trendUp={true}
            subtext=""
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 overflow-x-hidden">
          {/* Weekly Overview */}
          <Card className="border-0 shadow-sm rounded-xl col-span-2 overflow-x-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-800">Visão Semanal</CardTitle>
              <select className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white">
                <option>Esta Semana</option>
                <option>Semana Passada</option>
                <option>Mês Passado</option>
              </select>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                    <YAxis yAxisId="left" orientation="left" stroke="#888" fontSize={12} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickFormatter={(value) => `R$${value}`}
                      stroke="#888"
                      fontSize={12}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'revenue' ? `R$${value}` : value,
                        name === 'revenue' ? 'Receita' : 'Consultas'
                      ]}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '12px'
                      }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="appointments"
                      fill="#d946ef"
                      name="Consultas"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="revenue"
                      fill="#ec4899"
                      name="Receita"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Distribution */}
          <Card className="border-0 shadow-sm rounded-xl overflow-x-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-800">Distribuição de Tratamentos</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex justify-center items-center">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={treatmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {treatmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Porcentagem']}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-3 justify-center">
                {treatmentData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span>{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-x-hidden">
          {/* Recent Activity */}
          <Card className="border-0 shadow-sm rounded-xl lg:col-span-2 overflow-x-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-800">Próximas Consultas</CardTitle>
              <button 
                className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center"
                onClick={() => navigate('/appointments')}
              >
                Ver Todos <ChevronRight size={16} />
              </button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mt-2">
                {appointments.slice(0, 5).map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  const statusStyles = {
                    scheduled: 'bg-pink-50 text-pink-500',
                    completed: 'bg-teal-50 text-teal-500',
                    cancelled: 'bg-gray-50 text-gray-500'
                  };

                  return (
                    <div key={appointment.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-rose-50/50 transition-colors">
                      <div className={`p-2 rounded-full ${statusStyles[appointment.status] || 'bg-pink-50 text-pink-500'}`}>
                        {appointment.status === 'scheduled' ? (
                          <Clock size={16} />
                        ) : appointment.status === 'completed' ? (
                          <CheckCircle size={16} />
                        ) : (
                          <Calendar size={16} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{patient?.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
                        </p>
                        <p className="text-xs font-medium text-pink-600 mt-1">
                          {appointment.type}
                        </p>
                      </div>
                      <div className="text-xs font-medium px-2 py-1 rounded-full bg-white border border-gray-100 shadow-sm text-gray-600">
                        {appointment.status === 'scheduled' ? 'Agendado' : 
                         appointment.status === 'completed' ? 'Concluído' : 'Cancelado'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm rounded-xl overflow-x-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-800">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mt-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center p-3 rounded-lg hover:bg-rose-50/50 transition-colors text-left"
                    onClick={action.action}
                  >
                    <div className={`p-2 rounded-full mr-4 bg-${action.color}-100 text-${action.color}-500`}>
                      <action.icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{action.title}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendUp?: boolean;
  subtext?: string;
}

const StatsCard = ({ title, value, icon: Icon, iconBg, iconColor, trend, trendUp, subtext }: StatsCardProps) => {
  return (
    <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-semibold text-gray-800">{value}</h3>
            {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
            {trend && (
              <div className={`flex items-center mt-2 text-xs font-medium ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trendUp ? '↑' : '↓'} {trend}
              </div>
            )}
          </div>
          <div className={`${iconBg} p-3 rounded-xl ${iconColor}`}>
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;