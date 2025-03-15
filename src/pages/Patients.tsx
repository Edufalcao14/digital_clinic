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
import { Search, MoreVertical, UserPlus } from "lucide-react";
import useAppStore from "@/store/useAppStore";
import { calculateAge } from "@/utils/ageCalculator";
import { format } from "date-fns";

const Patients = () => {
  const { patients } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dental-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="page-title mb-0">Pacientes</h1>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pacientes..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button asChild className="bg-dental-600 hover:bg-dental-700">
            <p onClick={()=> navigate(`/patients/add`)} className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              Adicionar Paciente
            </p>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Paciente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Próxima Consulta</TableHead>
              <TableHead className="text-right">Ações</TableHead>
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
                      className="hover:text-dental-600 hover:underline transition-colors"
                    >
                      {patient.name}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{patient.email}</span>
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
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <p onClick={() => navigate(`/patients/${patient.id}`)}>
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

// Helper component to show upcoming appointment
const AppointmentStatus = ({ patientId }: { patientId: string }) => {
  const { appointments } = useAppStore();
  
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

export default Patients;
