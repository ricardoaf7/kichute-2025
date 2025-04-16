
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Control } from "react-hook-form";
import { MatchFormValues } from "@/contexts/matches/types";
import { useEffect, useState } from "react";

interface DateTimeSelectorProps {
  control: Control<MatchFormValues>;
}

export const DateTimeSelector = ({ control }: DateTimeSelectorProps) => {
  return (
    <FormField
      control={control}
      name="matchDate"
      render={({ field }) => {
        // Formatar o tempo para exibição no input time
        const timeString = field.value ? format(new Date(field.value), "HH:mm") : "16:00";

        return (
          <FormItem className="flex flex-col">
            <FormLabel>Data e Hora</FormLabel>
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
                      format(new Date(field.value), "dd/MM/yyyy 'às' HH:mm", { locale: pt })
                    ) : (
                      <span>Selecione a data e hora</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      // Manter a hora atual se já existir uma data selecionada
                      const newDate = new Date(date);
                      if (field.value) {
                        const currentDate = new Date(field.value);
                        newDate.setHours(currentDate.getHours());
                        newDate.setMinutes(currentDate.getMinutes());
                      } else {
                        // Hora padrão se não houver data selecionada
                        newDate.setHours(16);
                        newDate.setMinutes(0);
                      }
                      field.onChange(newDate);
                    }
                  }}
                  disabled={(date) => date < new Date("2024-01-01")}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
                <div className="p-3 border-t border-border">
                  <Input
                    type="time"
                    value={timeString}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      const newDate = field.value ? new Date(field.value) : new Date();
                      newDate.setHours(hours, minutes);
                      field.onChange(newDate);
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
