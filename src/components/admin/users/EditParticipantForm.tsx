
import { useState } from "react";
import { Player } from "@/types";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserInfoFields } from "./edit-form/UserInfoFields";
import { PasswordFields } from "./edit-form/PasswordFields";
import { UserTypeField } from "./edit-form/UserTypeField";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  password: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .optional()
    .or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
  tipo: z.enum(["Participante", "Administrador"]),
}).refine(data => {
  if (data.password || data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

interface EditParticipantFormProps {
  participant: Player;
  onSubmit: (data: { name: string; password?: string; tipo: "Participante" | "Administrador" }) => void;
  onCancel: () => void;
}

export function EditParticipantForm({ participant, onSubmit, onCancel }: EditParticipantFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: participant.name,
      password: "",
      confirmPassword: "",
      tipo: participant.role || "Participante"
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit({
      name: data.name,
      ...(data.password ? { password: data.password } : {}),
      tipo: data.tipo
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <UserInfoFields form={form} />
        <PasswordFields form={form} />
        <UserTypeField form={form} />

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
