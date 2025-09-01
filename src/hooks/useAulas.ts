import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Aula {
  id: string;
  nome: string;
  tipo: string;
  dia_semana: number;
  horario_inicio: string;
  horario_fim: string;
  ativa: boolean;
  instrutor_id?: string;
  created_at: string;
  usuarios?: {
    nome: string;
  };
  turmas?: {
    nome: string;
  };
}

export const useAulas = () => {
  return useQuery({
    queryKey: ["aulas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aulas")
        .select(`
          *,
          usuarios:instrutor_id (
            nome
          ),
          turmas (
            nome
          )
        `)
        .eq("ativa", true)
        .order("dia_semana", { ascending: true })
        .order("horario_inicio", { ascending: true });

      if (error) {
        console.error("Error fetching classes:", error);
        throw error;
      }

      return data as Aula[];
    },
  });
};

export const useWeeklyAttendance = () => {
  return useQuery({
    queryKey: ["weekly-attendance"],
    queryFn: async () => {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const attendancePromises = last7Days.map(async (date) => {
        const { count } = await supabase
          .from("presencas")
          .select("*", { count: "exact", head: true })
          .eq("status", "Presente")
          .gte("created_at", `${date} 00:00:00`)
          .lt("created_at", `${date} 23:59:59`);

        const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        const dayName = dayNames[new Date(date).getDay()];
        
        return {
          name: dayName,
          total: count || 0
        };
      });

      const attendanceData = await Promise.all(attendancePromises);
      return attendanceData;
    },
  });
};