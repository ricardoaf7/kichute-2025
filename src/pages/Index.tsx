
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PLAYERS, ROUNDS } from "../utils/mockData";
import StandingsTable from "../components/StandingsTable";
import RoundSelector from "../components/RoundSelector";
import { ArrowRight, Calendar, Award, Boot } from "lucide-react";

const Index = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Sort players by total points for quick standings view
  const topPlayers = [...PLAYERS].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 5);

  // Get the next round that is not closed
  const nextOpenRound = ROUNDS.find(round => !round.closed)?.number || 1;

  return (
    <div className={`page-container transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-slide-down">
          <div className="inline-block px-3 py-1 mb-3 text-sm font-medium rounded-full bg-goal/10 text-goal">
            Bolão do Brasileirão
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Kichute 2025
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kichute nas rodadas e corra o risco de ganhar uma grana dos seus patos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Link 
            to="/matches" 
            className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 hover:shadow-card-hover hover:border-border/80 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="p-3 rounded-md bg-field/10 text-field w-fit">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Partidas</h3>
            <p className="mt-2 text-muted-foreground flex-grow">
              Veja os jogos da rodada atual e resultados anteriores.
            </p>
            <div className="flex items-center mt-4 text-field font-medium">
              <span>Ver partidas</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Link>
          
          <Link 
            to="/guesses" 
            className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 hover:shadow-card-hover hover:border-border/80 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="p-3 rounded-md bg-goal/10 text-goal w-fit">
              <Boot className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Kichutes</h3>
            <p className="mt-2 text-muted-foreground flex-grow">
              Registre seus kichutes para a próxima rodada.
            </p>
            <div className="flex items-center mt-4 text-goal font-medium">
              <span>Fazer kichutes</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Link>
          
          <Link 
            to="/standings" 
            className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 hover:shadow-card-hover hover:border-border/80 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="p-3 rounded-md bg-amber-500/10 text-amber-500 w-fit">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Classificação</h3>
            <p className="mt-2 text-muted-foreground flex-grow">
              Veja quem está liderando o bolão neste momento.
            </p>
            <div className="flex items-center mt-4 text-amber-500 font-medium">
              <span>Ver classificação</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Link>
        </div>
        
        <div className="mt-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold">Classificação</h2>
            <Link to="/standings" className="flex items-center text-goal hover:text-goal-dark mt-2 md:mt-0">
              <span>Ver classificação completa</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <StandingsTable players={topPlayers} />
        </div>
        
        <div className="mt-12 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold">Próxima Rodada</h2>
            <Link to={`/guesses?round=${nextOpenRound}`} className="flex items-center text-goal hover:text-goal-dark mt-2 md:mt-0">
              <span>Fazer kichutes</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 p-6">
            <RoundSelector 
              rounds={ROUNDS} 
              currentRound={nextOpenRound} 
              onRoundChange={setCurrentRound} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
