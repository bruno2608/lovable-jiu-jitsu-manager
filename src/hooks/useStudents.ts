import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Student {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  foto_url?: string;
  data_nascimento?: string;
  created_at: string;
  ativo: boolean;
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
          matriculas:aluno_id (
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

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching students:", error);
        throw error;
      }

      const raw = (data ?? []) as any[];
      const normalized = raw.map((item) => ({
        ...item,
        matriculas: Array.isArray((item as any).matriculas) ? (item as any).matriculas : [],
      }));
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