import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      // Get total active students
      const { count: totalStudents } = await supabase
        .from("usuarios")
        .select("*", { count: "exact", head: true })
        .eq("ativo", true)
        .not("matriculas", "is", null);

      // Get total classes this week
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      const { count: totalClasses } = await supabase
        .from("aulas")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfWeek.toISOString())
        .lte("created_at", endOfWeek.toISOString());

      // Calculate attendance rate
      let attendanceRate = "0%";
      try {
        const { data: attendanceData } = await supabase
          .from("presencas")
          .select("status")
          .gte("created_at", startOfWeek.toISOString());

        if (attendanceData && attendanceData.length > 0) {
          const presentCount = attendanceData.filter(p => p.status === "Presente").length;
          const rate = Math.round((presentCount / attendanceData.length) * 100);
          attendanceRate = `${rate}%`;
        }
      } catch (error) {
        console.log("Attendance data not available");
      }

      // Get next graduation
      let nextGraduation = "N/A";
      try {
        const { data: graduationData } = await supabase
          .from("graduacoes")
          .select("data_graduacao")
          .gte("data_graduacao", new Date().toISOString().split('T')[0])
          .order("data_graduacao", { ascending: true })
          .limit(1);

        if (graduationData && graduationData.length > 0) {
          const daysUntil = Math.ceil(
            (new Date(graduationData[0].data_graduacao).getTime() - new Date().getTime()) / 
            (1000 * 60 * 60 * 24)
          );
          nextGraduation = `${daysUntil} dias`;
        }
      } catch (error) {
        console.log("Graduation data not available");
      }

      return {
        totalStudents: totalStudents || 0,
        totalClasses: totalClasses || 0,
        attendanceRate,
        nextGraduation,
      };
    },
  });
};