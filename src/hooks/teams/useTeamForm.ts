
import { useState } from "react";
import { Team } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TeamFormData {
  name: string;
  shortName: string;
  logoUrl: string;
}

export const useTeamForm = (onSuccess: (team: Team) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    shortName: "",
    logoUrl: ""
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: "",
      shortName: "",
      logoUrl: ""
    });
    setCurrentTeam(null);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.shortName) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e sigla são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (currentTeam) {
        const { error } = await supabase
          .from('times')
          .update({
            nome: formData.name,
            sigla: formData.shortName,
            escudo_url: formData.logoUrl
          })
          .eq('id', currentTeam.id);
          
        if (error) throw error;

        const updatedTeam: Team = {
          ...currentTeam,
          name: formData.name,
          shortName: formData.shortName,
          logoUrl: formData.logoUrl
        };
        
        onSuccess(updatedTeam);
        toast({
          title: "Time atualizado",
          description: `${formData.name} foi atualizado com sucesso.`
        });
      } else {
        const { data, error } = await supabase
          .from('times')
          .insert({
            nome: formData.name,
            sigla: formData.shortName,
            escudo_url: formData.logoUrl
          })
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          const newTeam: Team = {
            id: data[0].id,
            name: data[0].nome,
            shortName: data[0].sigla,
            homeStadium: "",
            city: "",
            logoUrl: data[0].escudo_url
          };
          
          onSuccess(newTeam);
          toast({
            title: "Time criado",
            description: `${formData.name} foi adicionado com sucesso.`
          });
        }
      }
    } catch (error: any) {
      console.error('Erro ao salvar time:', error);
      toast({
        title: "Erro ao salvar time",
        description: error.message || "Ocorreu um erro ao salvar o time.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsDialogOpen(false);
      resetForm();
    }
  };

  return {
    formData,
    setFormData,
    currentTeam,
    setCurrentTeam,
    isSubmitting,
    isDialogOpen,
    setIsDialogOpen,
    handleSubmit,
    resetForm
  };
};
