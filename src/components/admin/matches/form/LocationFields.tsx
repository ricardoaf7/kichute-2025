
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MatchFormValues } from "@/contexts/MatchesContext";

interface LocationFieldsProps {
  form: UseFormReturn<MatchFormValues>;
}

export const LocationFields = ({ form }: LocationFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="stadium"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estádio</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nome do estádio" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cidade</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nome da cidade" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
