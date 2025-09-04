import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  foto_url?: string;
  faixa_label: string;
  faixa_color: string;
}

export interface Presenca {
  id: string;
  aluno_id: string;
  aula_instancia_id: string;
  status: string;
  observacao?: string;
  registrada_por?: string;
  created_at: string;
  updated_at: string;
}

export interface SavePresencasRequest {
  aula_instancia_id: string;
  presencas: Array<{
    aluno_id: string;
    status: string;
    observacao?: string;
  }>;
}

// Hook to get students from a class (turma) based on aula_instancia_id
export const useAlunosTurma = (aulaInstanciaId: string) => {
  return useQuery({
    queryKey: ["alunos-turma", aulaInstanciaId],
    queryFn: async () => {
      if (!aulaInstanciaId) return [];
      
      // Get the aula_instancia to find turma_id
      const { data: aulaInstancia, error: aulaError } = await supabase
        .from("aulas_instancias")
        .select(`
          aula_id,
          aulas (
            turma_id
          )
        `)
        .eq("id", aulaInstanciaId)
        .single();

      if (aulaError) throw aulaError;
      
      const turmaId = aulaInstancia?.aulas?.turma_id;
      if (!turmaId) return [];

      // Get students enrolled in this turma
      const { data: matriculas, error: matriculasError } = await supabase
        .from("matriculas")
        .select(`
          aluno_id,
          usuarios (
            id,
            nome,
            email,
            telefone,
            foto_url
          )
        `)
        .eq("turma_id", turmaId)
        .eq("status", "Ativa");

      if (matriculasError) throw matriculasError;

      // Get user IDs to fetch graduations
      const userIds = (matriculas || []).map(m => m.aluno_id).filter(Boolean);
      
      let graduacoes: any[] = [];
      if (userIds.length > 0) {
        const { data: gradData, error: gradError } = await supabase
          .from("graduacoes")
          .select("aluno_id, faixa, grau, status, created_at")
          .in("aluno_id", userIds)
          .order("created_at", { ascending: false });
        
        if (!gradError) {
          graduacoes = gradData ?? [];
        }
      }

      // Create map of latest graduation by user
      const latestGradByUser = new Map();
      graduacoes.forEach(g => {
        const currentGrad = latestGradByUser.get(g.aluno_id);
        if (!currentGrad) {
          latestGradByUser.set(g.aluno_id, g);
        } else {
          if (g.status === 'ativa' && currentGrad.status !== 'ativa') {
            latestGradByUser.set(g.aluno_id, g);
          } else if (g.status === currentGrad.status && new Date(g.created_at) > new Date(currentGrad.created_at)) {
            latestGradByUser.set(g.aluno_id, g);
          }
        }
      });

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

      // Transform data
      return (matriculas || [])
        .filter(m => m.usuarios)
        .map(m => {
          const usuario = m.usuarios!;
          const grad = latestGradByUser.get(usuario.id);
          
          let beltKey = 'branca';
          let grau = 0;
          
          if (grad?.faixa) {
            beltKey = grad.faixa.toLowerCase();
            grau = grad.grau || 0;
          }

          return {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            foto_url: usuario.foto_url,
            faixa_label: BELT_LABEL[beltKey] + (grau > 0 ? ` • ${grau}º grau` : ''),
            faixa_color: BELT_COLOR[beltKey],
          };
        }) as Aluno[];
    },
    enabled: !!aulaInstanciaId,
  });
};

// Hook to get existing presencas for a class instance
export const usePresencas = (aulaInstanciaId: string) => {
  return useQuery({
    queryKey: ["presencas", aulaInstanciaId],
    queryFn: async () => {
      if (!aulaInstanciaId) return [];
      
      const { data, error } = await supabase
        .from("presencas")
        .select("*")
        .eq("aula_instancia_id", aulaInstanciaId);

      if (error) throw error;
      return data as Presenca[];
    },
    enabled: !!aulaInstanciaId,
  });
};

// Hook to save presencas in batch
export const useSavePresencas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SavePresencasRequest) => {
      const response = await supabase.functions.invoke('presencas-manual', {
        body: data,
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erro ao salvar presenças');
      }

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["presencas", variables.aula_instancia_id] 
      });
    },
    onError: (error) => {
      console.error("Error saving presencas:", error);
    },
  });
};

// Hook to import Excel file
export const useImportExcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await supabase.functions.invoke('presencas-importar-excel', {
        body: formData,
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erro ao importar Excel');
      }

      return response.data;
    },
    onSuccess: (_, formData) => {
      const aulaInstanciaId = formData.get('aula_instancia_id') as string;
      queryClient.invalidateQueries({ 
        queryKey: ["presencas", aulaInstanciaId] 
      });
    },
    onError: (error) => {
      console.error("Error importing Excel:", error);
    },
  });
};