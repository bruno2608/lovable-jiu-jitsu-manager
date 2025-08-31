export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      academias: {
        Row: {
          ativa: boolean | null
          cnpj: string | null
          codigo_convite: string | null
          created_at: string | null
          data_cadastro: string | null
          email: string | null
          endereco: string | null
          id: string
          logo_url: string | null
          nome: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativa?: boolean | null
          cnpj?: string | null
          codigo_convite?: string | null
          created_at?: string | null
          data_cadastro?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativa?: boolean | null
          cnpj?: string | null
          codigo_convite?: string | null
          created_at?: string | null
          data_cadastro?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      alunos: {
        Row: {
          altura: string | null
          created_at: string | null
          data_inicio: string | null
          emergencia_contato: string | null
          emergencia_telefone: string | null
          faixa: string | null
          faixa_id: number | null
          grau: number | null
          id: string
          mensalidade_dia_vencimento: number | null
          mensalidade_valor: number | null
          observacoes: string | null
          peso: string | null
          plano: string | null
          updated_at: string | null
        }
        Insert: {
          altura?: string | null
          created_at?: string | null
          data_inicio?: string | null
          emergencia_contato?: string | null
          emergencia_telefone?: string | null
          faixa?: string | null
          faixa_id?: number | null
          grau?: number | null
          id: string
          mensalidade_dia_vencimento?: number | null
          mensalidade_valor?: number | null
          observacoes?: string | null
          peso?: string | null
          plano?: string | null
          updated_at?: string | null
        }
        Update: {
          altura?: string | null
          created_at?: string | null
          data_inicio?: string | null
          emergencia_contato?: string | null
          emergencia_telefone?: string | null
          faixa?: string | null
          faixa_id?: number | null
          grau?: number | null
          id?: string
          mensalidade_dia_vencimento?: number | null
          mensalidade_valor?: number | null
          observacoes?: string | null
          peso?: string | null
          plano?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alunos_faixa_id_fkey"
            columns: ["faixa_id"]
            isOneToOne: false
            referencedRelation: "faixas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alunos_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alunos_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "view_alunos_inadimplentes"
            referencedColumns: ["id"]
          },
        ]
      }
      aulas: {
        Row: {
          ativa: boolean | null
          created_at: string | null
          dia_semana: number | null
          horario_fim: string
          horario_inicio: string
          id: string
          instrutor_id: string | null
          nome: string
          tipo: string
          turma_id: string | null
          updated_at: string | null
        }
        Insert: {
          ativa?: boolean | null
          created_at?: string | null
          dia_semana?: number | null
          horario_fim: string
          horario_inicio: string
          id?: string
          instrutor_id?: string | null
          nome: string
          tipo: string
          turma_id?: string | null
          updated_at?: string | null
        }
        Update: {
          ativa?: boolean | null
          created_at?: string | null
          dia_semana?: number | null
          horario_fim?: string
          horario_inicio?: string
          id?: string
          instrutor_id?: string | null
          nome?: string
          tipo?: string
          turma_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aulas_instrutor_id_fkey"
            columns: ["instrutor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aulas_instrutor_id_fkey"
            columns: ["instrutor_id"]
            isOneToOne: false
            referencedRelation: "view_alunos_inadimplentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aulas_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aulas_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "view_aulas_hoje"
            referencedColumns: ["turma_id"]
          },
        ]
      }
      aulas_instancias: {
        Row: {
          aula_id: string | null
          created_at: string | null
          data: string
          id: string
          instrutor_substituto_id: string | null
          observacoes: string | null
          status: string | null
        }
        Insert: {
          aula_id?: string | null
          created_at?: string | null
          data: string
          id?: string
          instrutor_substituto_id?: string | null
          observacoes?: string | null
          status?: string | null
        }
        Update: {
          aula_id?: string | null
          created_at?: string | null
          data?: string
          id?: string
          instrutor_substituto_id?: string | null
          observacoes?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aulas_instancias_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "aulas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aulas_instancias_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "view_aulas_hoje"
            referencedColumns: ["aula_id"]
          },
          {
            foreignKeyName: "aulas_instancias_instrutor_substituto_id_fkey"
            columns: ["instrutor_substituto_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aulas_instancias_instrutor_substituto_id_fkey"
            columns: ["instrutor_substituto_id"]
            isOneToOne: false
            referencedRelation: "view_alunos_inadimplentes"
            referencedColumns: ["id"]
          },
        ]
      }
      excecoes_turma: {
        Row: {
          aluno_id: string | null
          autorizado_por: string | null
          created_at: string | null
          id: string
          motivo: string
          turma_id: string | null
        }
        Insert: {
          aluno_id?: string | null
          autorizado_por?: string | null
          created_at?: string | null
          id?: string
          motivo: string
          turma_id?: string | null
        }
        Update: {
          aluno_id?: string | null
          autorizado_por?: string | null
          created_at?: string | null
          id?: string
          motivo?: string
          turma_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "excecoes_turma_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "excecoes_turma_autorizado_por_fkey"
            columns: ["autorizado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "excecoes_turma_autorizado_por_fkey"
            columns: ["autorizado_por"]
            isOneToOne: false
            referencedRelation: "view_alunos_inadimplentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "excecoes_turma_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "excecoes_turma_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "view_aulas_hoje"
            referencedColumns: ["turma_id"]
          },
        ]
      }
      faixas: {
        Row: {
          aulas_por_grau: number | null
          categoria: string | null
          cor_base: string | null
          cor_linha: string | null
          cor_ponteira: string | null
          created_at: string | null
          descricao: string | null
          exibe_ponteiras: boolean | null
          exibe_progresso: boolean | null
          graus: number | null
          id: number
          idade_minima: number | null
          metodo_graus: string | null
          nome: string
          ordem: number
          tempo_minimo_meses: number | null
          updated_at: string | null
        }
        Insert: {
          aulas_por_grau?: number | null
          categoria?: string | null
          cor_base?: string | null
          cor_linha?: string | null
          cor_ponteira?: string | null
          created_at?: string | null
          descricao?: string | null
          exibe_ponteiras?: boolean | null
          exibe_progresso?: boolean | null
          graus?: number | null
          id?: number
          idade_minima?: number | null
          metodo_graus?: string | null
          nome: string
          ordem: number
          tempo_minimo_meses?: number | null
          updated_at?: string | null
        }
        Update: {
          aulas_por_grau?: number | null
          categoria?: string | null
          cor_base?: string | null
          cor_linha?: string | null
          cor_ponteira?: string | null
          created_at?: string | null
          descricao?: string | null
          exibe_ponteiras?: boolean | null
          exibe_progresso?: boolean | null
          graus?: number | null
          id?: number
          idade_minima?: number | null
          metodo_graus?: string | null
          nome?: string
          ordem?: number
          tempo_minimo_meses?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      graduacoes: {
        Row: {
          aluno_id: string | null
          avaliado_em: string | null
          created_at: string | null
          data_graduacao: string
          faixa_anterior: string | null
          faixa_nova: string | null
          grau_anterior: number | null
          grau_novo: number
          id: string
          observacoes: string | null
          professor_id: string | null
          status: string | null
          tipo_solicitacao: string | null
        }
        Insert: {
          aluno_id?: string | null
          avaliado_em?: string | null
          created_at?: string | null
          data_graduacao: string
          faixa_anterior?: string | null
          faixa_nova?: string | null
          grau_anterior?: number | null
          grau_novo: number
          id?: string
          observacoes?: string | null
          professor_id?: string | null
          status?: string | null
          tipo_solicitacao?: string | null
        }
        Update: {
          aluno_id?: string | null
          avaliado_em?: string | null
          created_at?: string | null
          data_graduacao?: string
          faixa_anterior?: string | null
          faixa_nova?: string | null
          grau_anterior?: number | null
          grau_novo?: number
          id?: string
          observacoes?: string | null
          professor_id?: string | null
          status?: string | null
          tipo_solicitacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "graduacoes_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "graduacoes_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "graduacoes_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "view_alunos_inadimplentes"
            referencedColumns: ["id"]
          },
        ]
      }
      matriculas: {
        Row: {
          academia_id: string | null
          aluno_id: string | null
          created_at: string | null
          data_fim: string | null
          data_inicio: string
          id: string
          matriculado_por: string | null
          numero: number | null
          observacoes: string | null
          status: string | null
          turma_id: string | null
          updated_at: string | null
        }
        Insert: {
          academia_id?: string | null
          aluno_id?: string | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string
          id?: string
          matriculado_por?: string | null
          numero?: number | null
          observacoes?: string | null
          status?: string | null
          turma_id?: string | null
          updated_at?: string | null
        }
        Update: {
          academia_id?: string | null
          aluno_id?: string | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string
          id?: string
          matriculado_por?: string | null
          numero?: number | null
          observacoes?: string | null
          status?: string | null
          turma_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_academia"
            columns: ["academia_id"]
            isOneToOne: false
            referencedRelation: "academias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matriculas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matriculas_matriculado_por_fkey"
            columns: ["matriculado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matriculas_matriculado_por_fkey"
            columns: ["matriculado_por"]
            isOneToOne: false
            referencedRelation: "view_alunos_inadimplentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matriculas_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matriculas_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "view_aulas_hoje"
            referencedColumns: ["turma_id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          aluno_id: string | null
          ano_referencia: number | null
          comprovante_url: string | null
          created_at: string | null
          data_pagamento: string
          id: string
          mes_referencia: number | null
          metodo_pagamento: string | null
          observacoes: string | null
          registrado_por: string | null
          status: string | null
          valor: number
        }
        Insert: {
          aluno_id?: string | null
          ano_referencia?: number | null
          comprovante_url?: string | null
          created_at?: string | null
          data_pagamento: string
          id?: string
          mes_referencia?: number | null
          metodo_pagamento?: string | null
          observacoes?: string | null
          registrado_por?: string | null
          status?: string | null
          valor: number
        }
        Update: {
          aluno_id?: string | null
          ano_referencia?: number | null
          comprovante_url?: string | null
          created_at?: string | null
          data_pagamento?: string
          id?: string
          mes_referencia?: number | null
          metodo_pagamento?: string | null
          observacoes?: string | null
          registrado_por?: string | null
          status?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "view_alunos_inadimplentes"
            referencedColumns: ["id"]
          },
        ]
      }
      papeis: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: number
          nivel_acesso: number
          nome: string
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: number
          nivel_acesso: number
          nome: string
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: number
          nivel_acesso?: number
          nome?: string
        }
        Relationships: []
      }
      presencas: {
        Row: {
          aluno_id: string | null
          aula_instancia_id: string | null
          confirmada_por: string | null
          created_at: string | null
          id: string
          observacao: string | null
          registrada_por: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          aluno_id?: string | null
          aula_instancia_id?: string | null
          confirmada_por?: string | null
          created_at?: string | null
          id?: string
          observacao?: string | null
          registrada_por?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          aluno_id?: string | null
          aula_instancia_id?: string | null
          confirmada_por?: string | null
          created_at?: string | null
          id?: string
          observacao?: string | null
          registrada_por?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "presencas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presencas_aula_instancia_id_fkey"
            columns: ["aula_instancia_id"]
            isOneToOne: false
            referencedRelation: "aulas_instancias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presencas_aula_instancia_id_fkey"
            columns: ["aula_instancia_id"]
            isOneToOne: false
            referencedRelation: "view_aulas_hoje"
            referencedColumns: ["aula_instancia_id"]
          },
          {
            foreignKeyName: "presencas_confirmada_por_fkey"
            columns: ["confirmada_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presencas_confirmada_por_fkey"
            columns: ["confirmada_por"]
            isOneToOne: false
            referencedRelation: "view_alunos_inadimplentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presencas_registrada_por_fkey"
            columns: ["registrada_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presencas_registrada_por_fkey"
            columns: ["registrada_por"]
            isOneToOne: false
            referencedRelation: "view_alunos_inadimplentes"
            referencedColumns: ["id"]
          },
        ]
      }
      turmas: {
        Row: {
          academia_id: string | null
          ativa: boolean | null
          capacidade_maxima: number | null
          created_at: string | null
          descricao: string | null
          faixa_maxima: string | null
          faixa_minima: string | null
          id: string
          idade_maxima: number | null
          idade_minima: number | null
          nivel: string | null
          nome: string
          updated_at: string | null
        }
        Insert: {
          academia_id?: string | null
          ativa?: boolean | null
          capacidade_maxima?: number | null
          created_at?: string | null
          descricao?: string | null
          faixa_maxima?: string | null
          faixa_minima?: string | null
          id?: string
          idade_maxima?: number | null
          idade_minima?: number | null
          nivel?: string | null
          nome: string
          updated_at?: string | null
        }
        Update: {
          academia_id?: string | null
          ativa?: boolean | null
          capacidade_maxima?: number | null
          created_at?: string | null
          descricao?: string | null
          faixa_maxima?: string | null
          faixa_minima?: string | null
          id?: string
          idade_maxima?: number | null
          idade_minima?: number | null
          nivel?: string | null
          nome?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "turmas_academia_id_fkey"
            columns: ["academia_id"]
            isOneToOne: false
            referencedRelation: "academias"
            referencedColumns: ["id"]
          },
        ]
      }
      turmas_responsaveis: {
        Row: {
          created_at: string | null
          id: string
          papel: string
          turma_id: string | null
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          papel: string
          turma_id?: string | null
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          papel?: string
          turma_id?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "turmas_responsaveis_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "turmas_responsaveis_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "view_aulas_hoje"
            referencedColumns: ["turma_id"]
          },
          {
            foreignKeyName: "turmas_responsaveis_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "turmas_responsaveis_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "view_alunos_inadimplentes"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          auth_id: string | null
          cpf: string | null
          created_at: string | null
          data_cadastro: string | null
          data_nascimento: string | null
          email: string
          faixa_id: number | null
          foto_url: string | null
          genero: string | null
          grau: number | null
          id: string
          nome: string
          senha: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          auth_id?: string | null
          cpf?: string | null
          created_at?: string | null
          data_cadastro?: string | null
          data_nascimento?: string | null
          email: string
          faixa_id?: number | null
          foto_url?: string | null
          genero?: string | null
          grau?: number | null
          id?: string
          nome: string
          senha?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          auth_id?: string | null
          cpf?: string | null
          created_at?: string | null
          data_cadastro?: string | null
          data_nascimento?: string | null
          email?: string
          faixa_id?: number | null
          foto_url?: string | null
          genero?: string | null
          grau?: number | null
          id?: string
          nome?: string
          senha?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      usuarios_papeis: {
        Row: {
          concedido_por: string | null
          created_at: string | null
          data_concessao: string | null
          id: string
          papel_id: number | null
          usuario_id: string | null
        }
        Insert: {
          concedido_por?: string | null
          created_at?: string | null
          data_concessao?: string | null
          id?: string
          papel_id?: number | null
          usuario_id?: string | null
        }
        Update: {
          concedido_por?: string | null
          created_at?: string | null
          data_concessao?: string | null
          id?: string
          papel_id?: number | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_papeis_concedido_por_fkey"
            columns: ["concedido_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_papeis_concedido_por_fkey"
            columns: ["concedido_por"]
            isOneToOne: false
            referencedRelation: "view_alunos_inadimplentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_papeis_papel_id_fkey"
            columns: ["papel_id"]
            isOneToOne: false
            referencedRelation: "papeis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_papeis_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_papeis_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "view_alunos_inadimplentes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      view_alunos_inadimplentes: {
        Row: {
          dias_atraso: number | null
          email: string | null
          id: string | null
          mensalidade_dia_vencimento: number | null
          mensalidade_valor: number | null
          nome: string | null
          telefone: string | null
        }
        Relationships: []
      }
      view_aulas_hoje: {
        Row: {
          aula: string | null
          aula_id: string | null
          aula_instancia_id: string | null
          horario_fim: string | null
          horario_inicio: string | null
          instrutor: string | null
          instrutor_id: string | null
          status: string | null
          tipo: string | null
          total_alunos_turma: number | null
          total_presencas: number | null
          turma: string | null
          turma_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_role: {
        Args: { p_role_name: string; p_user_id: string }
        Returns: boolean
      }
      get_academy_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          ativo: boolean | null
          auth_id: string | null
          cpf: string | null
          created_at: string | null
          data_cadastro: string | null
          data_nascimento: string | null
          email: string
          faixa_id: number | null
          foto_url: string | null
          genero: string | null
          grau: number | null
          id: string
          nome: string
          senha: string | null
          telefone: string | null
          updated_at: string | null
        }[]
      }
      get_my_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          nivel_acesso: number
          nome: string
          papel_id: number
        }[]
      }
      get_my_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          ativo: boolean | null
          auth_id: string | null
          cpf: string | null
          created_at: string | null
          data_cadastro: string | null
          data_nascimento: string | null
          email: string
          faixa_id: number | null
          foto_url: string | null
          genero: string | null
          grau: number | null
          id: string
          nome: string
          senha: string | null
          telefone: string | null
          updated_at: string | null
        }[]
      }
      get_user_academy: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_access_level: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_by_id: {
        Args: { user_id: string }
        Returns: {
          ativo: boolean | null
          auth_id: string | null
          cpf: string | null
          created_at: string | null
          data_cadastro: string | null
          data_nascimento: string | null
          email: string
          faixa_id: number | null
          foto_url: string | null
          genero: string | null
          grau: number | null
          id: string
          nome: string
          senha: string | null
          telefone: string | null
          updated_at: string | null
        }[]
      }
      has_role: {
        Args: { role_name: string; user_id: string }
        Returns: boolean
      }
      is_same_academy: {
        Args: { record_academia_id: string }
        Returns: boolean
      }
      remove_role: {
        Args: { p_role_name: string; p_user_id: string }
        Returns: boolean
      }
      update_user: {
        Args: {
          p_data_nascimento?: string
          p_email?: string
          p_foto_url?: string
          p_genero?: string
          p_nome?: string
          p_telefone?: string
          p_user_id: string
        }
        Returns: {
          ativo: boolean | null
          auth_id: string | null
          cpf: string | null
          created_at: string | null
          data_cadastro: string | null
          data_nascimento: string | null
          email: string
          faixa_id: number | null
          foto_url: string | null
          genero: string | null
          grau: number | null
          id: string
          nome: string
          senha: string | null
          telefone: string | null
          updated_at: string | null
        }[]
      }
      user_has_access_level: {
        Args: { min_level: number }
        Returns: boolean
      }
      user_has_role: {
        Args: { role_name: string }
        Returns: boolean
      }
      user_role_level: {
        Args: { user_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
