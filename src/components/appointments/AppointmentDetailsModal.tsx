import {
    User,
    Clock,
    CheckCircle,
    Phone,
    Mail,
    Calendar as CalendarIcon,
    StickyNote,
} from 'lucide-react';
import { FaTooth } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { AppointmentWithPatient } from '@/types/appointment.types';
import { useNavigate } from 'react-router-dom';

interface AppointmentDetailsModalProps {
    isOpen: boolean;
    appointment: AppointmentWithPatient;
    onClose: () => void;
}

export const AppointmentDetailsModal = ({
    isOpen,
    appointment,
    onClose,
}: AppointmentDetailsModalProps) => {
    const navigate = useNavigate();

    const handlePatientClick = () => {
        navigate(`/patients/${appointment.patientId}`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-gray-800">
                        Detalhes do Agendamento
                    </DialogTitle>
                </DialogHeader>

                {/* Modal Body */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-teal-600" />
                        <div className="flex-grow">
                            <span className="text-sm text-gray-500">Paciente</span>
                            <p 
                                className="text-gray-800 font-medium hover:text-teal-600 cursor-pointer"
                                onClick={handlePatientClick}
                            >
                                {appointment.patientName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-teal-600" />
                        <div>
                            <span className="text-sm text-gray-500">Data</span>
                            <p className="text-gray-800 font-medium">
                                {format(appointment.start, 'dd/MM/yyyy')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-teal-600" />
                        <div>
                            <span className="text-sm text-gray-500">Horário</span>
                            <p className="text-gray-800 font-medium">
                                {format(appointment.start, 'HH:mm')} - {format(appointment.end, 'HH:mm')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <FaTooth className="w-5 h-5 text-teal-600" />
                        <div>
                            <span className="text-sm text-gray-500">Procedimento</span>
                            <p className="text-gray-800 font-medium">{appointment.type}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {appointment.contactMethod === 'phone' ? (
                            <Phone className="w-5 h-5 text-teal-600" />
                        ) : (
                            <Mail className="w-5 h-5 text-teal-600" />
                        )}
                        <div>
                            <span className="text-sm text-gray-500">Contato</span>
                            <p className="text-gray-800 font-medium">{appointment.contact}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <StickyNote className="w-5 h-5 text-teal-600 mt-1" />
                        <div>
                            <span className="text-sm text-gray-500">Observações</span>
                            <p className="text-gray-800 whitespace-pre-wrap">
                                {appointment.notes || "Nenhuma observação registrada"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600" />
                        <div>
                            <span className="text-sm text-gray-500">Status</span>
                            <p className="text-gray-800 font-medium capitalize">{appointment.status}</p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-gray-200 text-gray-600 hover:bg-gray-100"
                    >
                        Fechar
                    </Button>
                    <Button
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                        Editar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}; 