
-- Criação da tabela de perfis (extensão da tabela de autenticação)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (id)
);

-- RLS (Row Level Security) para perfis
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela de perfis
CREATE POLICY "Perfis visíveis para todos usuários autenticados"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem editar seus próprios perfis"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Tabela de temporadas
CREATE TABLE IF NOT EXISTS public.seasons (
  id SERIAL PRIMARY KEY,
  year INT NOT NULL,
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para temporadas
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Temporadas visíveis para todos usuários autenticados"
  ON public.seasons
  FOR SELECT
  TO authenticated
  USING (true);

-- Tabela de times
CREATE TABLE IF NOT EXISTS public.teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para times
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Times visíveis para todos usuários autenticados"
  ON public.teams
  FOR SELECT
  TO authenticated
  USING (true);

-- Tabela de partidas
CREATE TABLE IF NOT EXISTS public.matches (
  id TEXT PRIMARY KEY,
  season_id INTEGER REFERENCES public.seasons(id),
  round_number INTEGER NOT NULL,
  home_team_id TEXT REFERENCES public.teams(id),
  away_team_id TEXT REFERENCES public.teams(id),
  home_score INTEGER,
  away_score INTEGER,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  played BOOLEAN DEFAULT false,
  stadium TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para partidas
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partidas visíveis para todos usuários autenticados"
  ON public.matches
  FOR SELECT
  TO authenticated
  USING (true);

-- Tabela de rodadas
CREATE TABLE IF NOT EXISTS public.rounds (
  id SERIAL PRIMARY KEY,
  season_id INTEGER REFERENCES public.seasons(id),
  number INTEGER NOT NULL,
  closed BOOLEAN DEFAULT false,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(season_id, number)
);

-- RLS para rodadas
ALTER TABLE public.rounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rodadas visíveis para todos usuários autenticados"
  ON public.rounds
  FOR SELECT
  TO authenticated
  USING (true);

-- Tabela de jogadores (participantes)
CREATE TABLE IF NOT EXISTS public.players (
  id UUID PRIMARY KEY REFERENCES public.profiles(id),
  season_id INTEGER REFERENCES public.seasons(id),
  total_points INTEGER DEFAULT 0,
  paid_amount DECIMAL(10, 2) DEFAULT 0.00,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(id, season_id)
);

-- RLS para jogadores
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jogadores visíveis para todos usuários autenticados"
  ON public.players
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem editar seu próprio registro de jogador"
  ON public.players
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Tabela de palpites (kichutes)
CREATE TABLE IF NOT EXISTS public.guesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id TEXT REFERENCES public.matches(id),
  player_id UUID REFERENCES public.players(id),
  home_score INTEGER NOT NULL,
  away_score INTEGER NOT NULL,
  points INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(match_id, player_id)
);

-- RLS para palpites
ALTER TABLE public.guesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Palpites visíveis para todos usuários autenticados"
  ON public.guesses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem inserir seus próprios palpites"
  ON public.guesses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Usuários podem atualizar seus próprios palpites"
  ON public.guesses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = player_id);

-- Tabela de pontuação por rodada
CREATE TABLE IF NOT EXISTS public.round_points (
  id SERIAL PRIMARY KEY,
  round_id INTEGER REFERENCES public.rounds(id),
  player_id UUID REFERENCES public.players(id),
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(round_id, player_id)
);

-- RLS para pontuação por rodada
ALTER TABLE public.round_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pontuações de rodada visíveis para todos usuários autenticados"
  ON public.round_points
  FOR SELECT
  TO authenticated
  USING (true);

-- Tabela de premiações
CREATE TABLE IF NOT EXISTS public.prizes (
  id SERIAL PRIMARY KEY,
  season_id INTEGER REFERENCES public.seasons(id),
  month TEXT NOT NULL,
  player_id UUID REFERENCES public.players(id),
  amount DECIMAL(10, 2) NOT NULL,
  paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para premiações
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Premiações visíveis para todos usuários autenticados"
  ON public.prizes
  FOR SELECT
  TO authenticated
  USING (true);

-- Tabela de configurações de pontuação
CREATE TABLE IF NOT EXISTS public.scoring_system (
  id SERIAL PRIMARY KEY,
  season_id INTEGER REFERENCES public.seasons(id),
  exact_score INTEGER NOT NULL,
  correct_difference_or_draw INTEGER NOT NULL,
  correct_winner INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(season_id)
);

-- RLS para sistema de pontuação
ALTER TABLE public.scoring_system ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sistema de pontuação visível para todos usuários autenticados"
  ON public.scoring_system
  FOR SELECT
  TO authenticated
  USING (true);

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS public.payments (
  id SERIAL PRIMARY KEY,
  player_id UUID REFERENCES public.players(id),
  season_id INTEGER REFERENCES public.seasons(id),
  month TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para pagamentos
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pagamentos visíveis para todos usuários autenticados"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem registrar seus próprios pagamentos"
  ON public.payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = player_id);

-- Funções e triggers para manter dados atualizados
CREATE OR REPLACE FUNCTION update_player_total_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.players p
  SET total_points = (
    SELECT COALESCE(SUM(rp.points), 0)
    FROM public.round_points rp
    WHERE rp.player_id = p.id
  ),
  updated_at = NOW()
  WHERE p.id = NEW.player_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER round_points_update_trigger
AFTER INSERT OR UPDATE ON public.round_points
FOR EACH ROW
EXECUTE FUNCTION update_player_total_points();

-- Função para calcular pontos de um palpite
CREATE OR REPLACE FUNCTION calculate_guess_points(
  home_guess INTEGER,
  away_guess INTEGER,
  home_score INTEGER,
  away_score INTEGER,
  exact_score INTEGER,
  correct_diff_or_draw INTEGER,
  correct_winner INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  points INTEGER := 0;
BEGIN
  -- Acertou o placar exato
  IF home_guess = home_score AND away_guess = away_score THEN
    points := exact_score;
  
  -- Acertou o empate (mas não o placar exato)
  ELSIF (home_score = away_score) AND (home_guess = away_guess) THEN
    points := correct_diff_or_draw;
  
  -- Acertou o vencedor e a diferença de gols
  ELSIF (home_score > away_score AND home_guess > away_guess AND (home_score - away_score) = (home_guess - away_guess))
     OR (away_score > home_score AND away_guess > home_guess AND (away_score - home_score) = (away_guess - home_guess)) THEN
    points := correct_diff_or_draw;
  
  -- Acertou apenas o vencedor
  ELSIF (home_score > away_score AND home_guess > away_guess)
     OR (away_score > home_score AND away_guess > home_guess) THEN
    points := correct_winner;
  
  -- Não acertou nada
  ELSE
    points := 0;
  END IF;
  
  RETURN points;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar pontos de palpites quando um resultado é registrado
CREATE OR REPLACE FUNCTION update_guess_points()
RETURNS TRIGGER AS $$
DECLARE
  scoring_record RECORD;
  new_points INTEGER;
BEGIN
  -- Só atualiza se a partida foi marcada como jogada
  IF NEW.played = true AND NEW.home_score IS NOT NULL AND NEW.away_score IS NOT NULL THEN
    -- Buscar sistema de pontuação atual
    SELECT * INTO scoring_record FROM public.scoring_system 
    WHERE season_id = NEW.season_id
    LIMIT 1;
    
    -- Se não encontrar configuração, usar valores padrão
    IF scoring_record IS NULL THEN
      scoring_record.exact_score := 7;
      scoring_record.correct_difference_or_draw := 4;
      scoring_record.correct_winner := 2;
    END IF;
    
    -- Atualizar pontos de todos os palpites para esta partida
    FOR new_points IN
      UPDATE public.guesses g
      SET 
        points = calculate_guess_points(
          g.home_score, g.away_score, 
          NEW.home_score, NEW.away_score,
          scoring_record.exact_score, 
          scoring_record.correct_difference_or_draw,
          scoring_record.correct_winner
        ),
        updated_at = NOW()
      WHERE g.match_id = NEW.id
      RETURNING g.points
    LOOP
      -- Já atualizou dentro do loop
      NULL;
    END LOOP;
    
    -- Recalcular pontos dos jogadores por rodada
    UPDATE public.round_points rp
    SET 
      points = (
        SELECT COALESCE(SUM(g.points), 0)
        FROM public.guesses g
        JOIN public.matches m ON g.match_id = m.id
        JOIN public.rounds r ON m.round_number = r.number AND m.season_id = r.season_id
        WHERE g.player_id = rp.player_id AND r.id = rp.round_id
      ),
      updated_at = NOW()
    FROM public.rounds r
    JOIN public.matches m ON r.number = m.round_number AND r.season_id = m.season_id
    WHERE m.id = NEW.id AND rp.round_id = r.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER match_result_update_trigger
AFTER UPDATE OF home_score, away_score, played ON public.matches
FOR EACH ROW
EXECUTE FUNCTION update_guess_points();

-- Função para atualizar pagamentos de jogadores
CREATE OR REPLACE FUNCTION update_player_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar status de pagamento do jogador
  UPDATE public.players p
  SET 
    paid_amount = (
      SELECT COALESCE(SUM(amount), 0)
      FROM public.payments
      WHERE player_id = p.id AND season_id = p.season_id
    ),
    is_paid = (
      SELECT COALESCE(SUM(amount), 0) >= 10.00
      FROM public.payments
      WHERE player_id = p.id 
        AND season_id = p.season_id
        AND (
          month = TO_CHAR(NOW(), 'MM-YYYY')
          OR amount >= 90.00 -- pagamento anual
        )
    ),
    updated_at = NOW()
  WHERE p.id = NEW.player_id AND p.season_id = NEW.season_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_update_trigger
AFTER INSERT OR UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION update_player_payment_status();
