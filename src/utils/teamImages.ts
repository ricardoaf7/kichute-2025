
export const getTeamImagePath = (name: string): string => {
  if (!name) return "/placeholder.svg";

  // Normaliza o nome do time (remove acentos, converte para minúsculas)
  const normalizedName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Mapeamento de nomes de times para os arquivos de escudo
  const teamMap: { [key: string]: string } = {
    "atletico-mg": "atletico_mineiro",
    "atletico mineiro": "atletico_mineiro",
    "atletico-pr": "athletico_paranaense",
    "athletico-pr": "athletico_paranaense",
    "athletico paranaense": "athletico_paranaense",
    "bahia": "bahia",
    "botafogo": "botafogo",
    "corinthians": "corinthians",
    "cruzeiro": "cruzeiro",
    "cuiaba": "cuiaba",
    "flamengo": "flamengo",
    "fluminense": "fluminense",
    "fortaleza": "fortaleza",
    "gremio": "gremio",
    "internacional": "internacional",
    "juventude": "juventude",
    "palmeiras": "palmeiras",
    "red bull bragantino": "bragantino",
    "bragantino": "bragantino",
    "sao paulo": "sao_paulo",
    "vasco": "vasco",
    "vitoria": "vitoria",
    "criciuma": "criciuma",
    "atletico-go": "atletico_goianiense",
    "atletico goianiense": "atletico_goianiense",
    "santos": "santos",
    "sport": "sport",
    "ceara": "ceara",
    "mirassol": "mirassol"
  };

  // Buscar a chave correta no mapa ou retornar nome convertido (fallback)
  const teamKey = teamMap[normalizedName] || normalizedName.replace(/ /g, "_");

  console.log(`Buscando escudo para: ${name} (normalizado: ${normalizedName}) -> ${teamKey}`);

  return `/escudos/${teamKey}.png`;
};
