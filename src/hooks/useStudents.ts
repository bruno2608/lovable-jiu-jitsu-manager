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
    data_inicio: string;
  };
  matriculas?: {
    numero: number;
    created_at: string;
    status: string;
  }[];
}

function resolveUserBelt(u: any, latestGradByUser: Map<string, any>) {
  let beltKey: string | null = null;
  let grau: number | null = null;

  // 1) direto do usuário
  if (u.graduacao_atual || u.faixa_atual) {
    beltKey = (u.graduacao_atual || u.faixa_atual).toString().toLowerCase();
  }

  // 2) última graduação
  if (!beltKey && latestGradByUser.size) {
    const g = latestGradByUser.get(u.id);
    if (g) {
      beltKey = g.faixa?.toString().toLowerCase() || null;
      grau = g.grau ?? null;
    }
  }

  // 3) tabela alunos fallback
  if (!beltKey && u.alunos?.faixa) {
    beltKey = u.alunos.faixa.toString().toLowerCase();
  }

  // fallback final
  beltKey = BELT_ORDER.includes(beltKey as any) ? beltKey : 'branca';

  return {
    beltKey,
    grau,
    label: BELT_LABEL[beltKey] + (grau && grau > 0 ? ` • ${grau}º grau` : ''),
    color: BELT_COLOR[beltKey],
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
            data_inicio
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
          .select("*")
          .in("aluno_id", userIds)
          .order("data_graduacao", { ascending: false });
        
        if (!gradError) {
          graduacoes = gradData ?? [];
        }
      }

      // Criar mapa da graduação mais recente por usuário
      const latestGradByUser = new Map();
      graduacoes.forEach(g => {
        if (!latestGradByUser.has(g.aluno_id)) {
          // Prioriza graduações ativas, senão pega a mais recente
          if (g.status === 'ativa' || !latestGradByUser.get(g.aluno_id)) {
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