
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Save } from "lucide-react";
import { ScoringSystem } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const scoreSettingsSchema = z.object({
  exactScore: z.coerce.number().int().min(1).max(20),
  correctDifferenceOrDraw: z.coerce.number().int().min(1).max(15),
  correctWinner: z.coerce.number().int().min(1).max(10),
});

interface ScoreSettingsFormProps {
  initialValues: ScoringSystem;
  onSubmit: (values: ScoringSystem) => void;
}

export function ScoreSettingsForm({ initialValues, onSubmit }: ScoreSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ScoringSystem>({
    resolver: zodResolver(scoreSettingsSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = async (values: ScoringSystem) => {
    setIsSubmitting(true);
    
    try {
      onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="exactScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placar Exato</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={20} {...field} />
                </FormControl>
                <FormDescription>
                  Pontos para acertar o placar exato
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="correctDifferenceOrDraw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diferença ou Empate</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={15} {...field} />
                </FormControl>
                <FormDescription>
                  Pontos para acertar a diferença de gols ou empate
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="correctWinner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vencedor Correto</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={10} {...field} />
                </FormControl>
                <FormDescription>
                  Pontos para acertar apenas o vencedor
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </form>
    </Form>
  );
}
