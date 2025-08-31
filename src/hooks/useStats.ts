import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      // Get total students
      const { count: totalStudents } = await supabase
        .from("usuarios")
        .select("*", { count: "exact", head: true })
        .not("alunos", "is", null);

      // Get total classes this week
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      
      const { count: totalClasses } = await supabase
        .from("aulas_instancias")
        .select("*", { count: "exact", head: true })
        .gte("data", startOfWeek.toISOString().split('T')[0]);

      // Get attendance rate (mock for now)
      const attendanceRate = "78%";

      // Next graduation (mock for now)
      const nextGraduation = "18 dias";

      return {
        totalStudents: totalStudents || 0,
        totalClasses: totalClasses || 0,
        attendanceRate,
        nextGraduation,
      };
    },
  });
};