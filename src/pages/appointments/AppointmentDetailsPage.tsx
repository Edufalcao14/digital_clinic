import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
    User,
    Clock,
    Calendar as CalendarIcon,
    StickyNote,
    ArrowLeft,
    CreditCard
} from 'lucide-react';
import { FaTooth } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import useAppStore from '@/store/useAppStore';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Payment } from '@/types/types';

type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';
type PaymentMethod = 'cash' | 'card' | 'insurance' | 'other';

export const AppointmentDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

    const appointments = useAppStore((state) => state.appointments);
    const patients = useAppStore((state) => state.patients);
    const updateAppointment = useAppStore((state) => state.updateAppointment);

    const appointment = useMemo(
        () => appointments.find(apt => apt.id === id),
        [appointments, id]
    );

    const patient = useMemo(
        () => appointment ? patients.find(p => p.id === appointment.patientId) : null,
        [appointment, patients]
    );

    if (!appointment || !patient) {
        return (
            <div className="container mx-auto px-4 py-6">
                <h1>Agendamento não encontrado</h1>
                <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                </Button>
            </div>
        );
    }

    const handleStatusChange = (newStatus: string) => {
        updateAppointment(id, { ...appointment, status: newStatus as AppointmentStatus });
    };

    const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const newPayment: Partial<Payment> = {
            appointmentId: id,
            patientId: patient.id,
            amount: Number(formData.get('amount')),
            method: formData.get('method') as PaymentMethod,
            status: 'paid',
            date: new Date(),
            description: `Pagamento da consulta de ${format(appointment.date, 'dd/MM/yyyy')}`
        };

        // Assuming you have a function to add payment in your store
        // updateAppointmentPayment(id, newPayment);
        setIsPaymentDialogOpen(false);
    };

    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case 'scheduled': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'no-show': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-800">Detalhes do Agendamento</h1>
                </div>
                <Badge className={`text-sm px-3 py-1 ${getStatusColor(appointment.status)}`}>
                    {appointment.status === 'scheduled' ? 'Agendado' : 
                     appointment.status === 'completed' ? 'Finalizado' : 
                     appointment.status === 'cancelled' ? 'Cancelado' : 
                     appointment.status === 'no-show' ? 'Não Compareceu' : 
                     'Pendente'}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Informações do Agendamento</CardTitle>
                        <CardDescription>Detalhes da consulta</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <User className="w-5 h-5 text-teal-600" />
                                <div>
                                    <span className="text-sm text-gray-500">Paciente</span>
                                    <p onClick={() => navigate(`/patients/${patient.id}`)} className="font-medium text-gray-900 hover:underline cursor-pointer">{patient.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <CalendarIcon className="w-5 h-5 text-teal-600" />
                                <div>
                                    <span className="text-sm text-gray-500">Data</span>
                                    <p className="font-medium text-gray-900">
                                        {format(appointment.date, 'dd/MM/yyyy')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Clock className="w-5 h-5 text-teal-600" />
                                <div>
                                    <span className="text-sm text-gray-500">Horário</span>
                                    <p className="font-medium text-gray-900">
                                        {appointment.time} ({appointment.duration} min)
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <FaTooth className="w-5 h-5 text-teal-600" />
                                <div>
                                    <span className="text-sm text-gray-500">Procedimento</span>
                                    <p className="font-medium text-gray-900">{appointment.type}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-3">
                                <StickyNote className="w-5 h-5 text-teal-600 mt-1" />
                                <div>
                                    <span className="text-sm text-gray-500">Observações</span>
                                    <p className="text-gray-900 whitespace-pre-wrap mt-1">
                                        {appointment.notes || "Nenhuma observação registrada"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status and Payment Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status e Pagamento</CardTitle>
                        <CardDescription>Gerencie o status e pagamento</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Status da Consulta</Label>
                            <Select 
                                value={appointment.status} 
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scheduled">Agendado</SelectItem>
                                    <SelectItem value="completed">Finalizado</SelectItem>
                                    <SelectItem value="cancelled">Cancelado</SelectItem>
                                    <SelectItem value="no-show">Não Compareceu</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Valor Total</span>
                                <span className="text-lg font-bold text-teal-600">
                                    R$ {appointment.payment?.amount.toFixed(2) || '0,00'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-medium">Status do Pagamento</span>
                                <Badge variant={appointment.payment?.status === 'paid' ? "secondary" : "outline"}>
                                    {appointment.payment?.status === 'paid' ? 'Pago' : 'Pendente'}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        {appointment.status === 'completed' && !appointment.payment?.status && (
                            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full" variant="outline">
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Registrar Pagamento
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Registrar Pagamento</DialogTitle>
                                        <DialogDescription>
                                            Preencha os detalhes do pagamento abaixo
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handlePaymentSubmit}>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Método de Pagamento</Label>
                                                <Select name="method" defaultValue="card">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o método" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="card">Cartão</SelectItem>
                                                        <SelectItem value="cash">Dinheiro</SelectItem>
                                                        <SelectItem value="insurance">Convênio</SelectItem>
                                                        <SelectItem value="other">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Valor</Label>
                                                <Input 
                                                    name="amount"
                                                    type="number" 
                                                    step="0.01"
                                                    placeholder="0,00"
                                                    defaultValue={appointment.payment?.amount || 0}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit">Confirmar Pagamento</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                        <Button 
                            className="w-full"
                            onClick={() => navigate(`/appointments/${id}/edit`)}
                        >
                            Editar Agendamento
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};