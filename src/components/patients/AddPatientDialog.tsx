import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Patient } from '@/types/types';
import { Plus } from 'lucide-react';

// Shadcn/UI components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import usePatientsStore from '@/store/usePatientStore';

// Define the validation schema using Zod
const patientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter menos de 100 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').max(15, 'Telefone deve ter menos de 15 dígitos'),
  dateOfBirth: z.string().min(1, 'Data de nascimento é obrigatória'),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  medicalHistory: z.object({
    allergies: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional(),
    conditions: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }).optional(),
  dentalHistory: z.object({
    complaints: z.array(z.string()).optional(),
    treatments: z.array(z.string()).optional(),
  }).optional(),
});

// Type for the form data (inferred from the schema)
type PatientFormData = Omit<Patient, 'id' | 'createdAt'>;

const AddPatientForm = () => {
  const addPatient = usePatientsStore((state) => state.addPatient);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: null,
      address: '',
      emergencyContact: '',
      medicalHistory: {
        allergies: [],
        medications: [],
        conditions: [],
        notes: '',
      },
      dentalHistory: {
        complaints: [],
        treatments: [],
      },
    },
  });

  const onSubmit = (data: PatientFormData) => {
    // Convert dateOfBirth string to Date object
    const formattedData = {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
      dentalHistory: {
        ...data.dentalHistory,
        complaints: data.dentalHistory?.complaints || [],
      },
    };

    addPatient(formattedData);
    reset(); // Reset form after submission
    dialogCloseRef.current?.click(); // Close the dialog
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="text-pink-500 bg-transparent hover:bg-pink-50 hover:text-rose-600 text-xs border border-pink-200"
        >
          <Plus className="w-3 h-3 mr-1" />
          <span>Novo Paciente</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-md p-3 rounded-lg bg-white shadow-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-light text-rose-700">
            Novo Paciente
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-xs">
            Preencha os dados básicos abaixo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-xs font-medium text-pink-500">
              Nome Completo
            </Label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              className={`w-full rounded-md h-8 text-sm mt-1 ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Nome do paciente"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email and Phone in a grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-xs font-medium text-pink-500">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={`w-full rounded-md h-8 text-sm mt-1 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="email@exemplo.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-xs font-medium text-pink-500">
                Telefone
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                className={`w-full rounded-md h-8 text-sm mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="(00) 00000-0000"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <Label htmlFor="dateOfBirth" className="text-xs font-medium text-pink-500">
              Data de Nascimento
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
              className={`w-full rounded-md h-8 text-sm mt-1 ${errors.dateOfBirth ? 'border-red-500' : ''}`}
            />
            {errors.dateOfBirth && (
              <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth.message}</p>
            )}
          </div>

          {/* Address - reduced height */}
          <div>
            <Label htmlFor="address" className="text-xs font-medium text-pink-500">
              Endereço
            </Label>
            <Textarea
              id="address"
              {...register('address')}
              className={`w-full rounded-md min-h-[40px] text-sm mt-1 ${errors.address ? 'border-red-500' : ''}`}
              placeholder="Endereço completo"
            />
            {errors.address && (
              <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Emergency Contact - reduced height */}
          <div>
            <Label htmlFor="emergencyContact" className="text-xs font-medium text-pink-500">
              Contato de Emergência
            </Label>
            <Input
              id="emergencyContact"
              {...register('emergencyContact')}
              className={`w-full rounded-md h-8 text-sm mt-1 ${errors.emergencyContact ? 'border-red-500' : ''}`}
              placeholder="Nome e telefone do contato"
            />
            {errors.emergencyContact && (
              <p className="text-xs text-red-500 mt-1">{errors.emergencyContact.message}</p>
            )}
          </div>

          {/* Medical Notes - simplified */}
          <div>
            <Label htmlFor="medicalHistory.notes" className="text-xs font-medium text-pink-500">
              Histórico Médico
            </Label>
            <Textarea
              id="medicalHistory.notes"
              {...register('medicalHistory.notes')}
              className={`w-full rounded-md min-h-[40px] text-sm mt-1 ${errors.medicalHistory?.notes ? 'border-red-500' : ''}`}
              placeholder="Alergias, medicações, condições médicas..."
            />
            {errors.medicalHistory?.notes && (
              <p className="text-xs text-red-500 mt-1">{errors.medicalHistory.notes.message}</p>
            )}
          </div>

          {/* Dental Notes - simplified */}
          <div>
            <Label htmlFor="dentalHistory.complaints" className="text-xs font-medium text-pink-500">
              Histórico Odontológico
            </Label>
            <Textarea
              id="dentalHistory.complaints"
              {...register('dentalHistory.complaints.0')}
              className={`w-full rounded-md min-h-[40px] text-sm mt-1 ${errors.dentalHistory?.complaints ? 'border-red-500' : ''}`}
              placeholder="Queixas, tratamentos anteriores..."
            />
            {errors.dentalHistory?.complaints && (
              <p className="text-xs text-red-500 mt-1">{errors.dentalHistory.complaints.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 justify-end pt-2">
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              className="bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white"
            >
              Cadastrar
            </Button>
          </div>
        </form>
        <DialogClose ref={dialogCloseRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientForm;