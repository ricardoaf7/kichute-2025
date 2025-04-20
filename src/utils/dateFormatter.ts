
export const formatDate = (dateString: string) => {
  try {
    // Criar uma data a partir da string, mantendo o fuso horário original
    const date = new Date(dateString);

    // Formatar a data usando o locale pt-BR e especificando o fuso horário
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

// Função auxiliar para converter uma data para o formato ISO com fuso horário de Brasília
export const toBrasiliaISOString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Formato: YYYY-MM-DDTHH:MM:00-03:00 (para horário de Brasília)
  return `${year}-${month}-${day}T${hours}:${minutes}:00-03:00`;
};
