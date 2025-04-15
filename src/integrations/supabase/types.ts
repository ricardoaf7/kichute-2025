export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      jogadores: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          pagamento_total: number | null
          senha: string
          status_pagamento: string | null
          tipo: Database["public"]["Enums"]["tipo_usuario"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          pagamento_total?: number | null
          senha: string
          status_pagamento?: string | null
          tipo?: Database["public"]["Enums"]["tipo_usuario"]
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          pagamento_total?: number | null
          senha?: string
          status_pagamento?: string | null
          tipo?: Database["public"]["Enums"]["tipo_usuario"]
        }
        Relationships: []
      }
      kichutes: {
        Row: {
          id: string
          jogador_id: string | null
          palpite_casa: number | null
          palpite_visitante: number | null
          partida_id: string | null
          pontos: number | null
        }
        Insert: {
          id?: string
          jogador_id?: string | null
          palpite_casa?: number | null
          palpite_visitante?: number | null
          partida_id?: string | null
          pontos?: number | null
        }
        Update: {
          id?: string
          jogador_id?: string | null
          palpite_casa?: number | null
          palpite_visitante?: number | null
          partida_id?: string | null
          pontos?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kichutes_jogador_id_fkey"
            columns: ["jogador_id"]
            isOneToOne: false
            referencedRelation: "jogadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kichutes_partida_id_fkey"
            columns: ["partida_id"]
            isOneToOne: false
            referencedRelation: "partidas"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          data_pagamento: string | null
          id: string
          jogador_id: string | null
          valor: number | null
        }
        Insert: {
          data_pagamento?: string | null
          id?: string
          jogador_id?: string | null
          valor?: number | null
        }
        Update: {
          data_pagamento?: string | null
          id?: string
          jogador_id?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_jogador_id_fkey"
            columns: ["jogador_id"]
            isOneToOne: false
            referencedRelation: "jogadores"
            referencedColumns: ["id"]
          },
        ]
      }
      partidas: {
        Row: {
          data: string
          id: string
          local: string | null
          placar_casa: number | null
          placar_visitante: number | null
          rodada: number
          time_casa_id: string | null
          time_visitante_id: string | null
        }
        Insert: {
          data: string
          id?: string
          local?: string | null
          placar_casa?: number | null
          placar_visitante?: number | null
          rodada: number
          time_casa_id?: string | null
          time_visitante_id?: string | null
        }
        Update: {
          data?: string
          id?: string
          local?: string | null
          placar_casa?: number | null
          placar_visitante?: number | null
          rodada?: number
          time_casa_id?: string | null
          time_visitante_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partidas_time_casa_id_fkey"
            columns: ["time_casa_id"]
            isOneToOne: false
            referencedRelation: "times"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partidas_time_visitante_id_fkey"
            columns: ["time_visitante_id"]
            isOneToOne: false
            referencedRelation: "times"
            referencedColumns: ["id"]
          },
        ]
      }
      regras: {
        Row: {
          diferenca: number | null
          exato: number | null
          id: number
          vencedor: number | null
        }
        Insert: {
          diferenca?: number | null
          exato?: number | null
          id: number
          vencedor?: number | null
        }
        Update: {
          diferenca?: number | null
          exato?: number | null
          id?: number
          vencedor?: number | null
        }
        Relationships: []
      }
      times: {
        Row: {
          cidade: string
          escudo_url: string | null
          estadio: string
          id: string
          nome: string
          sigla: string
        }
        Insert: {
          cidade?: string
          escudo_url?: string | null
          estadio: string
          id?: string
          nome: string
          sigla: string
        }
        Update: {
          cidade?: string
          escudo_url?: string | null
          estadio?: string
          id?: string
          nome?: string
          sigla?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tipo_usuario: "Participante" | "Administrador"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      tipo_usuario: ["Participante", "Administrador"],
    },
  },
} as const
