import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BELT_ORDER = [
  'branca','cinza','amarela','laranja','verde',
  'azul','roxa','marrom','preta','coral','vermelha'
] as const;

const BELT_LABEL: Record<string, string> = {
  branca: 'Branca',
  cinza: 'Cinza',
  amarela: 'Amarela',
  laranja: 'Laranja',
  verde: 'Verde',
  azul: 'Azul',
  roxa: 'Roxa',
  marrom: 'Marrom',
  preta: 'Preta',
  coral: 'Coral',
  vermelha: 'Vermelha',
};

const BELT_COLOR: Record<string, string> = {
  branca: '#ffffff',
  cinza: '#A0AEC0',
  amarela: '#ECC94B',
  laranja: '#ED8936',
  verde: '#48BB78',
  azul: '#4299E1',
  roxa: '#9F7AEA',
  marrom: '#8B4513',
  preta: '#000000',
  coral: '#FF7F50',
  vermelha: '#E53E3E',
};

export interface Student {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  foto_url?: string;
  data_nascimento?: string;
  created_at: string;
  ativo: boolean;
  graduacao_atual?: string;
  faixa_atual?: string;
  faixa_label: string;
  faixa_key: string;
  faixa_color: string;
  grau: number | null;
  alunos?: {
    faixa: string;
    grau: number;
    data_inicio: string;
    faixa_id?: number;
    faixas?: {
      nome: string;
      ordem: number;
      graus: number;
      cor_base: string;
    };
  };
  matriculas?: {
    numero: number;
    created_at: string;
    status: string;
  }[];
}

function resolveUserBelt(u: any, latestGradByUser: Map<string, any>) {
  let beltName: string | null = null;
  let grau: number | null = null;
  let color: string | null = null;

  // 1) Primeiro, tentar usar dados da tabela faixas (mais confiável)
  if (u.alunos?.faixas?.nome) {
    beltName = u.alunos.faixas.nome;
    grau = u.alunos?.grau || 0;
    color = u.alunos.faixas.cor_base || '#ffffff';
  }
  // 2) Se não tiver faixa relacionada, usar faixa texto da tabela alunos
  else if (u.alunos?.faixa) {
    beltName = u.alunos.faixa;
    grau = u.alunos?.grau || 0;
    color = BELT_COLOR[beltName.toLowerCase()] || '#ffffff';
  }
  // 3) última graduação da tabela graduacoes
  else if (latestGradByUser.size > 0) {
    const g = latestGradByUser.get(u.id);
    if (g) {
      beltName = g.faixa?.toString() || null;
      grau = g.grau ?? null;
      color = BELT_COLOR[beltName?.toLowerCase()] || '#ffffff';
    }
  }
  // 4) direto do usuário (fallback)
  else if (u.graduacao_atual || u.faixa_atual) {
    beltName = (u.graduacao_atual || u.faixa_atual).toString();
    color = BELT_COLOR[beltName.toLowerCase()] || '#ffffff';
  }

  // fallback final
  if (!beltName) {
    beltName = 'Branca';
    grau = grau || 0;
    color = '#ffffff';
  }

  // Formatação do label
  const label = grau && grau > 0 ? `${beltName} • ${grau}º grau` : beltName;

  return {
    beltKey: beltName.toLowerCase(),
    grau: grau || 0,
    label,
    color: color || '#ffffff',
  };
}

export const useStudents = (searchTerm?: string, statusFilter?: string) => {
  return useQuery({
    queryKey: ["students", searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("usuarios")
        .select(`
          *,
          alunos (
            faixa,
            grau,
            data_inicio,
            faixa_id,
            faixas (
              nome,
              ordem,
              graus,
              cor_base
            )
          ),
          matriculas (
            numero,
            created_at,
            status,
            academia_id
          )
        `);

      // Apply search filter
      if (searchTerm && searchTerm.trim()) {
        query = query.or(`nome.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      // Apply status filter
      if (statusFilter === "ativo") {
        query = query.eq("ativo", true);
      } else if (statusFilter === "inativo") {
        query = query.eq("ativo", false);
      }

      const { data: users, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching students:", error);
        throw error;
      }

      // Buscar graduações dos usuários
      const userIds = (users ?? []).map(u => u.id);
      let graduacoes: any[] = [];
      
      if (userIds.length > 0) {
        const { data: gradData, error: gradError } = await supabase
          .from("graduacoes")
          .select("aluno_id, faixa, grau, data_graduacao, status, created_at")
          .in("aluno_id", userIds)
          .order("created_at", { ascending: false });
        
        if (!gradError) {
          graduacoes = gradData ?? [];
        }
      }

      // Criar mapa da graduação mais recente por usuário
      const latestGradByUser = new Map();
      graduacoes.forEach(g => {
        const currentGrad = latestGradByUser.get(g.aluno_id);
        if (!currentGrad) {
          // Primeira graduação para este usuário
          latestGradByUser.set(g.aluno_id, g);
        } else {
          // Prioriza graduações ativas (status = 'ativa'), senão pega a mais recente
          if (g.status === 'ativa' && currentGrad.status !== 'ativa') {
            latestGradByUser.set(g.aluno_id, g);
          } else if (g.status === currentGrad.status && new Date(g.created_at) > new Date(currentGrad.created_at)) {
            latestGradByUser.set(g.aluno_id, g);
          }
        }
      });

      const raw = (users ?? []) as any[];
      const normalized = raw.map((item) => {
        const belt = resolveUserBelt(item, latestGradByUser);
        return {
          ...item,
          matriculas: Array.isArray((item as any).matriculas) ? (item as any).matriculas : [],
          faixa_label: belt.label,
          faixa_key: belt.beltKey,
          faixa_color: belt.color,
          grau: belt.grau,
        };
      });
      return normalized as Student[];
    },
  });
};

export const useAddStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentData: {
      nome: string;
      email: string;
      telefone?: string;
      faixa: string;
    }) => {
      // Insert into usuarios table
      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .insert({
          nome: studentData.nome,
          email: studentData.email,
          telefone: studentData.telefone,
        })
        .select()
        .single();

      if (usuarioError) throw usuarioError;

      // Insert into alunos table
      const { error: alunoError } = await supabase
        .from("alunos")
        .insert({
          id: usuario.id,
          faixa: studentData.faixa,
          data_inicio: new Date().toISOString().split('T')[0],
        });

      if (alunoError) throw alunoError;

      return usuario;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Aluno adicionado com sucesso!");
    },
    onError: (error) => {
      console.error("Error adding student:", error);
      toast.error("Erro ao adicionar aluno");
    },
  });
};