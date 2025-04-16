
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Control } from "react-hook-form";
import { MatchFormValues } from "@/contexts/MatchesContext";

interface DateTimeSelectorProps {
  control: Control<MatchFormValues>;
  name: "matchDate";
  label: string;
}

export const DateTimeSelector = ({ control, name, label }: DateTimeSelectorProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={`w-full pl-3 text-left font-normal ${
                    !field.value ? "text-muted-foreground" : ""
                  }`}
                >
                  {field.value ? (
                    format(field.value, "PPP 'às' HH:mm", { locale: pt })
                  ) : (
                    <span>Selecione a data e hora</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date("2025-01-01")}
                initialFocus
              />
              <div className="p-3 border-t border-border">
                <Input
                  type="time"
                  onChange={(e) => {
                    const newDate = field.value || new Date();
                    const [hours, minutes] = e.target.value.split(':');
                    newDate.setHours(parseInt(hours, 10));
                    newDate.setMinutes(parseInt(minutes, 10));
                    field.onChange(newDate);
                  }}
                  defaultValue={field.value ? format(field.value, "HH:mm") : "16:00"}
                />
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
