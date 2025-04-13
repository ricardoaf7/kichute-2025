
import { useState } from "react";
import { Player } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DialogFooter } from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  paid: z.boolean().default(false),
  paidAmount: z.coerce.number().min(0).default(0),
  totalPoints: z.coerce.number().min(0).default(0)
});

type FormData = z.infer<typeof formSchema>;

interface NewParticipantFormProps {
  onSubmit: (data: Omit<Player, "id" | "roundPoints">) => void;
  onCancel: () => void;
}

export function NewParticipantForm({ onSubmit, onCancel }: NewParticipantFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      paid: false,
      paidAmount: 0,
      totalPoints: 0
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit({
      name: data.name,
      paid: data.paid,
      paidAmount: data.paidAmount,
      totalPoints: data.totalPoints
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do participante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paid"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Status de Pagamento</FormLabel>
                <FormDescription>
                  Marcado como {field.value ? "Pago" : "Pendente"}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paidAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Pago (R$)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Valor que o participante já pagou
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pontos Iniciais</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Pontos iniciais do participante (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
