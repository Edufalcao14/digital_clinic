import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
    User,
    Clock,
    Calendar as CalendarIcon,
    StickyNote,
    ArrowLeft,
    CreditCard,
    MoreVertical
} from 'lucide-react';
import { FaTooth } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Payment } from '@/types/types';
import usePatientsStore from '@/store/usePatientStore';
import useAppointmentsStore from '@/store/useAppointmentsStore';

type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';
type PaymentMethod = 'cash' | 'card' | 'insurance' | 'other';

export const AppointmentDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

    const appointments = useAppointmentsStore((state) => state.appointments);
    const patients = usePatientsStore((state) => state.patients);
    const updateAppointment = useAppointmentsStore((state) => state.updateAppointment);

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
            <div className="p-4">
                <h1 className="text-lg font-semibold text-gray-800 mb-4">Agendamento não encontrado</h1>
                <Button variant="outline" onClick={() => navigate('/appointments')} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para Agendamentos
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

    const getStatusBadgeVariant = (status: AppointmentStatus) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'cancelled':
            case 'no-show':
                return 'destructive';
            case 'scheduled':
                return 'default';
            default:
                return 'outline';
        }
    };

    const getStatusText = (status: AppointmentStatus) => {
        switch (status) {
            case 'scheduled': return 'Agendado';
            case 'completed': return 'Finalizado';
            case 'cancelled': return 'Cancelado';
            case 'no-show': return 'Não Compareceu';
            default: return 'Pendente';
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-4 md:hidden">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate(-1)} 
                    className="p-2"
                    aria-label="Voltar"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-2">
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate(`/appointments/${id}/edit`)}>
                            Editar Agendamento
                        </DropdownMenuItem>
                        {appointment.status === 'completed' && !appointment.payment?.status && (
                            <DropdownMenuItem onClick={() => setIsPaymentDialogOpen(true)}>
                                Registrar Pagamento
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className={appointment.status !== 'completed' ? "" : "text-muted-foreground"}
                            onClick={() => appointment.status !== 'completed' && handleStatusChange('completed')}
                            disabled={appointment.status === 'completed'}
                        >
                            Marcar como Concluído
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={appointment.status !== 'cancelled' ? "" : "text-muted-foreground"}
                            onClick={() => appointment.status !== 'cancelled' && handleStatusChange('cancelled')}
                            disabled={appointment.status === 'cancelled'}
                        >
                            Cancelar Agendamento
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={appointment.status !== 'no-show' ? "" : "text-muted-foreground"}
                            onClick={() => appointment.status !== 'no-show' && handleStatusChange('no-show')}
                            disabled={appointment.status === 'no-show'}
                        >
                            Marcar como Não Compareceu
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Voltar
                    </Button>
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-pink-600" />
                        <h1 className="text-xl font-semibold text-gray-800 lg:text-2xl">
                            Detalhes do Agendamento
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {appointment.status === 'completed' && !appointment.payment?.status && (
                        <Button 
                            variant="outline" 
                            onClick={() => setIsPaymentDialogOpen(true)}
                            className="hidden md:flex items-center gap-2"
                        >
                            <CreditCard className="w-4 h-4" />
                            Registrar Pagamento
                        </Button>
                    )}
                    <Button 
                        onClick={() => navigate(`/appointments/${id}/edit`)}
                        className="hidden md:flex items-center gap-2 bg-pink-600 hover:bg-pink-700"
                    >
                        Editar Agendamento
                    </Button>
                </div>
            </div>

            {/* Status Banner */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-base font-medium md:text-lg">
                        Consulta de {patient.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {format(appointment.date, 'dd/MM/yyyy')} às {appointment.time}
                    </p>
                </div>
                <Badge variant={getStatusBadgeVariant(appointment.status)} className="text-xs px-2 py-0.5">
                    {getStatusText(appointment.status)}
                </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Main Info Card */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium md:text-lg">
                            Informações do Agendamento
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        {/* Patient Info Section */}
                        <div className="p-3 border rounded-md">
                            <div className="flex items-center gap-3 mb-2">
                                <User className="w-5 h-5 text-pink-600" />
                                <span className="text-sm font-medium">Informações do Paciente</span>
                            </div>
                            <div className="ml-8">
                                <p 
                                    className="font-medium text-pink-600 hover:underline cursor-pointer"
                                    onClick={() => navigate(`/patients/${patient.id}`)}
                                >
                                    {patient.name}
                                </p>
                                {/* You can add more patient info here if needed */}
                            </div>
                        </div>

                        {/* Appointment Details Section */}
                        <div className="p-3 border rounded-md">
                            <div className="flex items-center gap-3 mb-2">
                                <FaTooth className="w-5 h-5 text-pink-600" />
                                <span className="text-sm font-medium">Detalhes do Procedimento</span>
                            </div>
                            <div className="ml-8">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Procedimento</p>
                                        <p className="font-medium">{appointment.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Duração</p>
                                        <p className="font-medium">{appointment.duration} minutos</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Date & Time Section */}
                        <div className="p-3 border rounded-md">
                            <div className="flex items-center gap-3 mb-2">
                                <Clock className="w-5 h-5 text-pink-600" />
                                <span className="text-sm font-medium">Data e Horário</span>
                            </div>
                            <div className="ml-8">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Data</p>
                                        <p className="font-medium">{format(appointment.date, 'dd/MM/yyyy')}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Horário</p>
                                        <p className="font-medium">{appointment.time}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="p-3 border rounded-md">
                            <div className="flex items-start gap-3 mb-2">
                                <StickyNote className="w-5 h-5 text-pink-600 mt-0.5" />
                                <span className="text-sm font-medium">Observações</span>
                            </div>
                            <div className="ml-8 mt-1">
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                    {appointment.notes || "Nenhuma observação registrada"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status and Payment Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium md:text-lg">
                            Status e Pagamento
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm">Status da Consulta</Label>
                            <Select 
                                value={appointment.status} 
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger className="w-full">
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

                        <div className="p-3 border rounded-md space-y-3">
                            <div className="flex items-center gap-3 mb-2">
                                <CreditCard className="w-5 h-5 text-pink-600" />
                                <span className="text-sm font-medium">Informações de Pagamento</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Valor Total</span>
                                <span className="text-lg font-bold text-pink-600">
                                    R$ {appointment.payment?.amount?.toFixed(2) || '0,00'}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Status do Pagamento</span>
                                <Badge variant={appointment.payment?.status === 'paid' ? "success" : "outline"}>
                                    {appointment.payment?.status === 'paid' ? 'Pago' : 'Pendente'}
                                </Badge>
                            </div>

                            {appointment.payment?.status === 'paid' && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Forma de Pagamento</span>
                                    <span className="text-sm capitalize">
                                        {appointment.payment.method === 'card' ? 'Cartão' :
                                         appointment.payment.method === 'cash' ? 'Dinheiro' :
                                         appointment.payment.method === 'insurance' ? 'Convênio' : 'Outro'}
                                    </span>
                                </div>
                            )}
                            
                            {appointment.status === 'completed' && !appointment.payment?.status && (
                                <div className="pt-2">
                                    <Button 
                                        className="w-full text-sm" 
                                        variant="outline"
                                        onClick={() => setIsPaymentDialogOpen(true)}
                                    >
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Registrar Pagamento
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    
                    <CardFooter className="block pt-2 pb-4 px-4">
                        <Button 
                            className="w-full bg-pink-600 hover:bg-pink-700 text-white md:hidden"
                            onClick={() => navigate(`/appointments/${id}/edit`)}
                        >
                            Editar Agendamento
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Payment Registration Dialog */}
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium text-gray-800">
                            Registrar Pagamento
                        </DialogTitle>
                        <DialogDescription>
                            Preencha os detalhes do pagamento abaixo
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePaymentSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Método de Pagamento</Label>
                                <Select name="method" defaultValue="card">
                                    <SelectTrigger className="w-full">
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
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                                    <Input 
                                        name="amount"
                                        type="number" 
                                        step="0.01"
                                        placeholder="0,00"
                                        className="pl-8"
                                        defaultValue={appointment.payment?.amount || 0}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsPaymentDialogOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit"
                                className="bg-pink-600 hover:bg-pink-700"
                            >
                                Confirmar Pagamento
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};