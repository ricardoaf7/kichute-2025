import { useState } from "react";
import { Match, Guess } from "../types";
import { calculatePoints, getPointsBadgeClass, getScoringDescription } from "../utils/scoring";
import { MapPin } from "lucide-react";

interface MatchCardProps {
  match: Match;
  userGuess?: Guess;
  onGuessChange?: (homeScore: number, awayScore: number) => void;
  editable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const MatchCard = ({
  match,
  userGuess,
  onGuessChange,
  editable = false,
  className = "",
  style,
}: MatchCardProps) => {
  const [homeGuess, setHomeGuess] = useState<number>(userGuess?.homeScore || 0);
  const [awayGuess, setAwayGuess] = useState<number>(userGuess?.awayScore || 0);

  const handleHomeScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setHomeGuess(value);
    if (onGuessChange) onGuessChange(value, awayGuess);
  };

  const handleAwayScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setAwayGuess(value);
    if (onGuessChange) onGuessChange(homeGuess, value);
  };

  const getPoints = () => {
    if (!match.played || !userGuess) return null;
    return calculatePoints(
      { homeScore: userGuess.homeScore, awayScore: userGuess.awayScore },
      { homeScore: match.homeScore, awayScore: match.awayScore }
    );
  };

  const points = getPoints();
  const isMatchPlayed = match.played && match.homeScore !== null && match.awayScore !== null;
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Função para obter o estádio e cidade da partida
  // Se o estádio e cidade estiverem especificados na partida, use-os
  // Caso contrário, use o estádio e cidade do time mandante
  const getStadiumInfo = () => {
    if (match.stadium) {
      return {
        stadium: match.stadium,
        city: match.city
      };
    } else if (match.homeTeam.homeStadium) {
      return {
        stadium: match.homeTeam.homeStadium,
        city: match.homeTeam.city
      };
    }
    return null;
  };

  const stadiumInfo = getStadiumInfo();

  const getTeamImagePath = (name: string) => {
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

  return (
    <div className={`gradient-border card-transition ${className}`} style={style}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Rodada {match.round}</span>
          <span>{formattedDate}</span>
        </div>

        {stadiumInfo && (
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span>
              {stadiumInfo.stadium}
              {stadiumInfo.city ? `, ${stadiumInfo.city}` : ""}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center">
            <div className="mr-2 flex items-center justify-center">
              <img
                src={getTeamImagePath(match.homeTeam.name)}
                alt={match.homeTeam.name}
                className="w-8 h-8 object-contain rounded-full border border-gray-300"
                onError={(e) => {
                  // Fallback em caso de erro ao carregar a imagem
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="text-right">
              <p className="font-semibold">{match.homeTeam.name}</p>
              <p className="text-sm text-muted-foreground">{match.homeTeam.shortName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 px-4">
            {isMatchPlayed ? (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold">{match.homeScore}</span>
                <span className="text-muted-foreground">x</span>
                <span className="text-lg font-bold">{match.awayScore}</span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded-md">
                Aguardando
              </div>
            )}
          </div>

          <div className="flex flex-1 items-center justify-end">
            <div className="text-left mr-2">
              <p className="font-semibold">{match.awayTeam.name}</p>
              <p className="text-sm text-muted-foreground">{match.awayTeam.shortName}</p>
            </div>
            <div className="ml-2 flex items-center justify-center">
              <img
                src={getTeamImagePath(match.awayTeam.name)}
                alt={match.awayTeam.name}
                className="w-8 h-8 object-contain rounded-full border border-gray-300"
                onError={(e) => {
                  // Fallback em caso de erro ao carregar a imagem
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
          </div>
        </div>

        {(userGuess || editable) && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Seu kichute:</span>
              {points !== null && (
                <span className={getPointsBadgeClass(points)}>{points} pts</span>
              )}
            </div>

            <div className="flex items-center justify-center mt-2 space-x-3">
              {editable ? (
                <>
                  <input
                    type="number"
                    min="0"
                    value={homeGuess}
                    onChange={handleHomeScoreChange}
                    className="w-12 h-10 form-input text-center"
                  />
                  <span className="text-muted-foreground">x</span>
                  <input
                    type="number"
                    min="0"
                    value={awayGuess}
                    onChange={handleAwayScoreChange}
                    className="w-12 h-10 form-input text-center"
                  />
                </>
              ) : userGuess ? (
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">{userGuess.homeScore}</span>
                  <span className="text-muted-foreground">x</span>
                  <span className="text-lg font-bold">{userGuess.awayScore}</span>
                  {points !== null && (
                    <span className="text-sm ml-2 text-muted-foreground">
                      ({getScoringDescription(points)})
                    </span>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
