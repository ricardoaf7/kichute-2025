
export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return 'Data inválida';
  }
};
