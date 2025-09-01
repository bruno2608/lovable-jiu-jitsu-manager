import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Graduacao {
  id: string;
  aluno_id: string;
  grau_anterior: number;
  grau_novo: number;
  data_graduacao: string;
  professor_id?: string;
  status: string;
  observacoes?: string;
  created_at: string;
  usuarios?: {
    nome: string;
    email: string;
  } | null;
  professor?: {
    nome: string;
  } | null;
}

export const useGraduacoes = () => {
  return useQuery({
    queryKey: ["graduacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("graduacoes")
        .select(`
          *,
          usuarios:aluno_id (
            nome,
            email
          ),
          professor:professor_id (
            nome
          )
        `)
        .order("data_graduacao", { ascending: true });

      if (error) {
        console.error("Error fetching graduations:", error);
        throw error;
      }

      return (data as any[]).map(item => ({
        ...item,
        usuarios: item.usuarios || null,
        professor: item.professor || null,
      })) as Graduacao[];
    },
  });
};

export const useUpcomingGraduacoes = () => {
  return useQuery({
    queryKey: ["upcoming-graduacoes"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from("graduacoes")
        .select(`
          *,
          usuarios:aluno_id (
            nome,
            email
          ),
          professor:professor_id (
            nome
          )
        `)
        .gte("data_graduacao", today)
        .order("data_graduacao", { ascending: true })
        .limit(10);

      if (error) {
        console.error("Error fetching upcoming graduations:", error);
        throw error;
      }

      return (data as any[]).map(item => ({
        ...item,
        usuarios: item.usuarios || null,
        professor: item.professor || null,
      })) as Graduacao[];
    },
  });
};