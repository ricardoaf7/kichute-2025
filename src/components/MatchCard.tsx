
import { useState } from "react";
import { Match, Guess } from "../types";
import { calculatePoints, getPointsBadgeClass, getScoringDescription } from "../utils/scoring";
import { MapPin, Shield } from "lucide-react";

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
    if (onGuessChange) {
      onGuessChange(value, awayGuess);
    }
  };

  const handleAwayScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setAwayGuess(value);
    if (onGuessChange) {
      onGuessChange(homeGuess, value);
    }
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
  const formattedDate = matchDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Função para obter a cor da bandeira com base no time (para fallback)
  const getTeamFlagColor = (teamId: string) => {
    // Cores das equipes
    const teamColors: {[key: string]: string} = {
      "1": "#231F20", // Atlético-MG - Preto
      "2": "#e30613", // Athletico-PR - Vermelho
      "3": "#0077c8", // Bahia - Azul
      "4": "#000000", // Botafogo - Preto
      "5": "#000000", // Corinthians - Preto
      "6": "#1e4c8f", // Cruzeiro - Azul
      "7": "#10643f", // Cuiabá - Verde
      "8": "#e30613", // Flamengo - Vermelho
      "9": "#8A1538", // Fluminense - Grená
      "10": "#0c2340", // Fortaleza - Azul escuro
      "11": "#0d87bf", // Grêmio - Azul claro
      "12": "#e30613", // Internacional - Vermelho
      "13": "#10643f", // Juventude - Verde
      "14": "#10643f", // Palmeiras - Verde
      "15": "#e30613", // RB Bragantino - Vermelho
      "16": "#e30613", // São Paulo - Vermelho
      "17": "#000000", // Vasco - Preto
      "18": "#e30613", // Vitória - Vermelho
      "19": "#ffcc00", // Criciúma - Amarelo
      "20": "#e30613", // Atlético-GO - Vermelho
    };
    return teamColors[teamId] || "#333333"; // Cor padrão caso não encontre
  };

  // Função para obter a URL do escudo do time (quando tivermos os escudos)
  const getTeamShieldUrl = (teamId: string) => {
    // No futuro, retornar URLs reais para os escudos
    // Por enquanto, retorna null para usar o ícone de escudo como fallback
    return null;
  };

  // Renderiza o escudo do time (imagem ou ícone fallback)
  const renderTeamShield = (teamId: string, shortName: string) => {
    const shieldUrl = getTeamShieldUrl(teamId);
    
    if (shieldUrl) {
      return (
        <img 
          src={shieldUrl} 
          alt="Escudo" 
          className="w-8 h-8 object-contain"
        />
      );
    } else {
      // Fallback: círculo colorido com a letra inicial
      return (
        <div 
          className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-200 shadow-sm"
          style={{ backgroundColor: getTeamFlagColor(teamId) }}
        >
          <span className="text-white text-xs font-bold">{shortName.substring(0, 1)}</span>
        </div>
      );
    }
  };

  return (
    <div className={`gradient-border card-transition ${className}`} style={style}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Rodada {match.round}</span>
          <span>{formattedDate}</span>
        </div>

        {(match.stadium || match.city) && (
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{match.stadium}{match.city ? `, ${match.city}` : ''}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center">
            <div className="mr-2 flex items-center justify-center">
              {renderTeamShield(match.homeTeam.id, match.homeTeam.shortName)}
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

          <div className="flex flex-1 items-center">
            <div className="text-left">
              <p className="font-semibold">{match.awayTeam.name}</p>
              <p className="text-sm text-muted-foreground">{match.awayTeam.shortName}</p>
            </div>
            <div className="ml-2 flex items-center justify-center">
              {renderTeamShield(match.awayTeam.id, match.awayTeam.shortName)}
            </div>
          </div>
        </div>

        {(userGuess || editable) && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Seu kichute:</span>
              {points !== null && (
                <span className={getPointsBadgeClass(points)}>
                  {points} pts
                </span>
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
