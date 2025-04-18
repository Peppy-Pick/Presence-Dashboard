import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DatePickerFieldProps {
  form: any;
  name: string;
  label: string;
}

export const DatePickerField = ({ form, name, label }: DatePickerFieldProps) => {
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear() - 18);
  const [selectedMonth, setSelectedMonth] = React.useState<number>(new Date().getMonth());

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year));
    const currentDate = form.getValues(name);
    if (currentDate) {
      const newDate = new Date(currentDate);
      newDate.setFullYear(parseInt(year));
      form.setValue(name, newDate);
      form.setValue('date_of_birth', format(newDate, 'yyyy-MM-dd'));
    }
  };

  const handleMonthChange = (month: string) => {
    const monthIndex = months.indexOf(month);
    setSelectedMonth(monthIndex);
    const currentDate = form.getValues(name);
    if (currentDate) {
      const newDate = new Date(currentDate);
      newDate.setMonth(monthIndex);
      form.setValue(name, newDate);
      form.setValue('date_of_birth', format(newDate, 'yyyy-MM-dd'));
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col h-[72px]">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal h-10",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex gap-2 p-3 border-b">
                <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={months[selectedMonth]} onValueChange={handleMonthChange}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  if (date) {
                    form.setValue('date_of_birth', format(date, 'yyyy-MM-dd'));
                    setSelectedYear(date.getFullYear());
                    setSelectedMonth(date.getMonth());
                  }
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                month={new Date(selectedYear, selectedMonth)}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePickerField;