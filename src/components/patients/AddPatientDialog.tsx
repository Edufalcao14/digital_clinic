import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useAppStore from '@/store/useAppStore'; // Adjust the path to your store
import { Patient } from '@/types/types';

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
import { Plus } from 'lucide-react';

// Define the validation schema using Zod
const patientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must be less than 15 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
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
  const addPatient = useAppStore((state) => state.addPatient);

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
      dateOfBirth: new Date(),
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
    };

    addPatient(formattedData);
    reset(); // Reset form after submission
    alert('Patient added successfully!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[600px] p-4 sm:p-6 rounded-lg bg-background">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-semibold text-center sm:text-left">
            Add New Patient
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center sm:text-left">
            Fill in the details below to add a new patient to the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input 
                id="name" 
                type="text" 
                {...register('name')} 
                className="w-full rounded-md border-input"
                placeholder="Enter patient name"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                {...register('email')} 
                className="w-full rounded-md border-input"
                placeholder="patient@example.com"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone
              </Label>
              <Input 
                id="phone" 
                type="tel" 
                {...register('phone')} 
                className="w-full rounded-md border-input"
                placeholder="(123) 456-7890"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                Date of Birth
              </Label>
              <Input 
                id="dateOfBirth" 
                type="date" 
                {...register('dateOfBirth')} 
                className="w-full rounded-md border-input"
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address
            </Label>
            <Textarea 
              id="address" 
              {...register('address')} 
              className="w-full rounded-md border-input min-h-[80px]"
              placeholder="Enter patient address"
            />
          </div>

          {/* Emergency Contact */}
          <div className="space-y-2">
            <Label htmlFor="emergencyContact" className="text-sm font-medium">
              Emergency Contact
            </Label>
            <Input 
              id="emergencyContact" 
              type="text" 
              {...register('emergencyContact')} 
              className="w-full rounded-md border-input"
              placeholder="Contact name and phone number"
            />
          </div>

          {/* Medical History - Notes */}
          <div className="space-y-2">
            <Label htmlFor="medicalHistory.notes" className="text-sm font-medium">
              Medical History Notes
            </Label>
            <Textarea 
              id="medicalHistory.notes" 
              {...register('medicalHistory.notes')} 
              className="w-full rounded-md border-input min-h-[100px]"
              placeholder="Enter any relevant medical history notes"
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
            >
              Add Patient
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientForm;