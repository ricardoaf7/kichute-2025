import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Team } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Save } from "lucide-react";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome do time é obrigatório"),
  shortName: z.string().min(1, "Abreviação é obrigatória").max(3, "Máximo de 3 caracteres"),
  homeStadium: z.string().min(1, "Nome do estádio é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
});

export type TeamFormValues = z.infer<typeof formSchema>;

interface TeamFormProps {
  editingTeam?: Team | null;
  teamId?: string | null;
  onSubmit?: (values: TeamFormValues) => void;
  onCancel?: () => void;
  onSaved?: () => void;
}

export const TeamForm = ({ editingTeam, teamId, onSubmit, onCancel, onSaved }: TeamFormProps) => {
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      shortName: "",
      homeStadium: "",
      city: "",
    },
  });

  useEffect(() => {
    if (editingTeam) {
      form.reset({
        id: editingTeam.id,
        name: editingTeam.name,
        shortName: editingTeam.shortName,
        homeStadium: editingTeam.homeStadium || "",
        city: editingTeam.city || "",
      });
    } else {
      form.reset({
        name: "",
        shortName: "",
        homeStadium: "",
        city: "",
      });
    }
  }, [editingTeam, form]);

  const handleFormSubmit = (values: TeamFormValues) => {
    if (onSubmit) {
      onSubmit(values);
    }
    if (onSaved) {
      onSaved();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingTeam || teamId ? "Editar Time" : "Novo Time"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Time</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Flamengo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abreviação (3 letras)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: FLA" maxLength={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="homeStadium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estádio Principal</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Maracanã" />
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
                    <Input {...field} placeholder="Ex: Rio de Janeiro" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                {editingTeam || teamId ? "Atualizar" : "Adicionar"}
              </Button>
              {(editingTeam || teamId) && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
