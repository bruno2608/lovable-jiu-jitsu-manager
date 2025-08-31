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
  alunos?: {
    faixa: string;
    data_inicio: string;
  };
}

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("usuarios")
        .select(`
          *,
          alunos (
            faixa,
            data_inicio
          )
        `)
        .not("alunos", "is", null);

      if (error) {
        console.error("Error fetching students:", error);
        throw error;
      }

      return data as Student[];
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