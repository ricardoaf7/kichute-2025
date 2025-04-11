
export const getTeamImagePath = (name: string): string => {
  // Mapeamento de nomes de times para os arquivos de escudo
  const teamMap: { [key: string]: string } = {
    "Atlético-MG": "atletico_mineiro",
    "Athletico-PR": "athletico_paranaense",
    "Bahia": "bahia",
    "Botafogo": "botafogo",
    "Corinthians": "corinthians",
    "Cruzeiro": "cruzeiro",
    "Cuiabá": "cuiaba",
    "Flamengo": "flamengo",
    "Fluminense": "fluminense",
    "Fortaleza": "fortaleza",
    "Grêmio": "gremio",
    "Internacional": "internacional",
    "Juventude": "juventude",
    "Palmeiras": "palmeiras",
    "Red Bull Bragantino": "bragantino",
    "São Paulo": "sao_paulo",
    "Vasco": "vasco",
    "Vitória": "vitoria",
    "Criciúma": "criciuma",
    "Atlético-GO": "atletico_goianiense",
    // Outros times que possam estar nos dados de exemplo
    "Santos": "santos",
    "Sport": "sport",
    "Ceará": "ceara",
    "Mirassol": "mirassol"
  };

  // Buscar a chave correta no mapa ou retornar nome convertido (fallback)
  const teamKey = teamMap[name] || name.toLowerCase().replace(/ /g, "_");
  return `/escudos/${teamKey}.png`;
};
