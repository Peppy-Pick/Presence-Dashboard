import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

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
import { Employee, updateEmployee } from '@/lib/api/employees';

const departments = [
  'Engineering',
  'Sales',
  'Marketing',
  'Human Resources',
  'Finance',
  'Operations',
  'Customer Support',
  'Research & Development',
  'Legal',
  'Other'
];

const employeeFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone_number: z.string()
    .regex(/^(\+91[\-\s]?)?[6789]\d{9}$/, 'Please enter a valid Indian phone number')
    .transform(val => val.startsWith('+91') ? val : `+91${val}`),
  designation: z.string().min(2, 'Designation must be at least 2 characters'),
  department: z.string().min(2, 'Department is required'),
  shift_start_time: z.string(),
  shift_start_meridiem: z.enum(['AM', 'PM']),
  shift_end_time: z.string(),
  shift_end_meridiem: z.enum(['AM', 'PM']),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EditEmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
  onEmployeeUpdated: () => void;
}

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({ 
  open, 
  onOpenChange,
  employee,
  onEmployeeUpdated
}) => {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: employee.name,
      email: employee.email,
      phone_number: employee.phone_number,
      designation: employee.designation,
      department: employee.department,
      address: employee.address,
      shift_start_time: '09:00',
      shift_start_meridiem: 'AM',
      shift_end_time: '06:00',
      shift_end_meridiem: 'PM',
    },
  });

  async function onSubmit(data: EmployeeFormValues) {
    try {
      const formattedData = {
        ...data,
        employee_shift_hours: `${data.shift_start_time} ${data.shift_start_meridiem} - ${data.shift_end_time} ${data.shift_end_meridiem}`,
      };

      await updateEmployee(employee.id, formattedData);
      
      toast.success('Employee updated successfully!');
      onOpenChange(false);
      onEmployeeUpdated();
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
      console.error('Error updating employee:', error);
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
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            Update employee information
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+91 9876543210" 
                        {...field} 
                        onChange={(e) => {
                          let value = e.target.value;
                          if (!value.startsWith('+91')) {
                            value = '+91' + value.replace(/^\+91/, '');
                          }
                          value = value.replace(/[^\d+]/g, '');
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
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street, City" {...field} />
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
            
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Update Employee</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeForm;