
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

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
});

type FormData = z.infer<typeof formSchema>;

interface UserInfoFieldsProps {
  form: UseFormReturn<FormData>;
}

export function UserInfoFields({ form }: UserInfoFieldsProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome de usuário</FormLabel>
          <FormControl>
            <Input placeholder="Digite o nome do participante" {...field} />
          </FormControl>
          <FormDescription>
            Este é o nome utilizado para login no sistema.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
