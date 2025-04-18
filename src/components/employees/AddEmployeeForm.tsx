import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, X } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import DatePickerField from './DatePickerField';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { clearDashboardCache } from '@/lib/api/dashboard';
import { clearEmployeeCache } from '@/lib/api/employees';
import { EMPLOYEE_API_BASE_URL } from '@/lib/api/utils';
import { useQueryClient } from '@tanstack/react-query';

const employeeFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  email: z.string().email('Please enter a valid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phone_number: z.string()
    .regex(/^(\+91[\-\s]?)?[6789]\d{9}$/, 'Please enter a valid Indian phone number (e.g., +91 9876543210)')
    .transform(val => val.startsWith('+91') ? val : `+91${val}`),
  designation: z.string().min(2, 'Designation must be at least 2 characters'),
  shift_start_time: z.string(),
  shift_start_meridiem: z.enum(['AM', 'PM']),
  shift_end_time: z.string(),
  shift_end_meridiem: z.enum(['AM', 'PM']),
  dob_date: z.date(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface AddEmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeAdded: () => void;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ 
  open, 
  onOpenChange,
  onEmployeeAdded
}) => {
  const queryClient = useQueryClient();
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: '',
      date_of_birth: '',
      email: '',
      address: '',
      phone_number: '+91 ',
      designation: '',
      shift_start_time: '09:00',
      shift_start_meridiem: 'AM',
      shift_end_time: '06:00',
      shift_end_meridiem: 'PM',
      dob_date: undefined,
    },
  });

  async function onSubmit(data: EmployeeFormValues) {
    try {
      const formattedData = {
        ...data,
        employee_shift_hours: `${data.shift_start_time} ${data.shift_start_meridiem} - ${data.shift_end_time} ${data.shift_end_meridiem}`,
      };

      const response = await fetch(`${EMPLOYEE_API_BASE_URL}/api/employee/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        clearEmployeeCache();
        clearDashboardCache();
        
        queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        
        toast.success('Employee added successfully!');
        onOpenChange(false);
        onEmployeeAdded();
        form.reset();
      } else {
        throw new Error(result.message || 'Failed to add employee');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
      console.error('Error adding employee:', error);
    }
  }

  const timeOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = (i + 1).toString().padStart(2, '0');
    const options = [];
    for (let minute = 0; minute < 60; minute += 30) {
      options.push(`${hour}:${minute.toString().padStart(2, '0')}`);
    }
    return options;
  }).flat();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Enter the employee details below to add them to the system.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="h-[72px]">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DatePickerField 
                form={form} 
                name="dob_date" 
                label="Date of Birth"
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="h-[72px]">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="h-[72px]">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+91 9876543210" 
                        {...field} 
                        className="h-10"
                        onChange={(e) => {
                          let value = e.target.value;
                          // Ensure the value starts with +91
                          if (!value.startsWith('+91')) {
                            value = '+91' + value.replace(/^\+91/, '');
                          }
                          // Remove any non-digit characters except the leading +
                          value = value.replace(/[^\d+]/g, '');
                          // Limit to 13 characters (+91 + 10 digits)
                          value = value.slice(0, 13);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem className="h-[72px]">
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="h-[72px]">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street, City" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Shift Hours</FormLabel>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="shift_start_time"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative">
                            <select
                              className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pl-3 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              {...field}
                            >
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shift_start_meridiem"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <select
                              className="flex h-10 w-24 appearance-none rounded-md border border-input bg-background px-3 py-2 pl-3 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              {...field}
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="shift_end_time"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative">
                            <select
                              className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pl-3 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              {...field}
                            >
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shift_end_meridiem"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <select
                              className="flex h-10 w-24 appearance-none rounded-md border border-input bg-background px-3 py-2 pl-3 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              {...field}
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" className="w-full md:w-auto">Add Employee</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeForm;