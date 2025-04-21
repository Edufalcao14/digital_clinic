import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, UserPlus, Users, Phone, Mail, Calendar } from "lucide-react";
import { calculateAge } from "@/utils/ageCalculator";
import { format } from "date-fns";
import usePatientsStore from "@/store/usePatientStore";
import useAppointmentsStore from "@/store/useAppointmentsStore";
import AddPatientForm from "@/components/patients/AddPatientDialog";

const Patients = () => {
  const patients = usePatientsStore((state) => state.patients);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-pink-600 md:w-6 md:h-6" />
          <h1 className="text-lg font-semibold text-gray-800 md:text-xl lg:text-2xl">
            Pacientes
          </h1>
        </div>
        
        {/* Search and Add Patient */}
        <div className="flex flex-col w-full gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pacientes..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto">
            <AddPatientForm />
          </div>
        </div>
      </div>

      {/* Mobile Patient Cards View (visible on small screens) */}
      <div className="flex flex-col gap-4 md:hidden">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground rounded-md border">
            Nenhum paciente encontrado.
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div 
              key={patient.id} 
              className="border rounded-lg p-4 shadow-sm"
              onClick={() => navigate(`/patients/${patient.id}`)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-dental-600">{patient.name}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <p onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/patients/${patient.id}`);
                      }} className="cursor-pointer">
                        View Details
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      Edit Patient
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      Schedule Appointment
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Delete Patient
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="mt-2 text-sm">{calculateAge(patient.dateOfBirth)} anos</div>
              
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span>{patient.phone}</span>
              </div>
              
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Mail className="w-3 h-3" />
                <span className="break-all">{patient.email}</span>
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium">Próxima Consulta:</span>
                </div>
                <MobileAppointmentStatus patientId={patient.id} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (hidden on small screens) */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Nome do Paciente</TableHead>
              <TableHead className="min-w-[180px]">Contato</TableHead>
              <TableHead className="min-w-[100px]">Idade</TableHead>
              <TableHead className="min-w-[180px]">Próxima Consulta</TableHead>
              <TableHead className="min-w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Nenhum paciente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    <p
                      onClick={() => navigate(`/patients/${patient.id}`)}
                      className="hover:text-dental-600 hover:underline transition-colors cursor-pointer"
                    >
                      {patient.name}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm break-all">{patient.email}</span>
                      <span className="text-xs text-muted-foreground">
                        {patient.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {calculateAge(patient.dateOfBirth)} anos
                  </TableCell>
                  <TableCell>
                    <AppointmentStatus patientId={patient.id} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <p onClick={() => navigate(`/patients/${patient.id}`)} className="cursor-pointer">
                            View Details
                          </p>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                        <DropdownMenuItem>
                          Schedule Appointment
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete Patient
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Outlet />
    </div>
  );
};

// Helper component for desktop view
const AppointmentStatus = ({ patientId }) => {
  const appointments = useAppointmentsStore((state) => state.appointments);
  
  const upcomingAppointment = appointments
    .filter(
      (apt) =>
        apt.patientId === patientId &&
        apt.status === "scheduled" &&
        new Date(apt.date) >= new Date()
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  if (!upcomingAppointment) {
    return <span className="text-sm text-muted-foreground">None scheduled</span>;
  }

  return (
    <div className="flex flex-col">
      <Badge variant="outline" className="text-xs font-normal w-fit">
        {upcomingAppointment.type}
      </Badge>
      <span className="text-xs text-muted-foreground mt-1">
        {format(new Date(upcomingAppointment.date), "MMM d, yyyy")} at{" "}
        {upcomingAppointment.time}
      </span>
    </div>
  );
};

// Mobile-specific appointment status component
const MobileAppointmentStatus = ({ patientId }) => {
  const appointments = useAppointmentsStore((state) => state.appointments);
  
  const upcomingAppointment = appointments
    .filter(
      (apt) =>
        apt.patientId === patientId &&
        apt.status === "scheduled" &&
        new Date(apt.date) >= new Date()
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  if (!upcomingAppointment) {
    return <span className="text-xs text-muted-foreground block mt-1">None scheduled</span>;
  }

  return (
    <div className="mt-1">
      <Badge variant="outline" className="text-xs font-normal">
        {upcomingAppointment.type}
      </Badge>
      <span className="text-xs text-muted-foreground block mt-1">
        {format(new Date(upcomingAppointment.date), "MMM d, yyyy")} at{" "}
        {upcomingAppointment.time}
      </span>
    </div>
  );
};

export default Patients;