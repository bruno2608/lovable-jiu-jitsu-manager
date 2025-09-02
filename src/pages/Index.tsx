
import { useState } from "react";
import { Users, CalendarDays, Award, UserRoundPlus } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard"; 
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { RecentStudents } from "@/components/dashboard/RecentStudents";
import { Button } from "@/components/ui/button";
import { StudentForm } from "@/components/students/StudentForm";
import { EmptyStateCard } from "@/components/EmptyStateCard";
import { useStudents, useAddStudent } from "@/hooks/useStudents";
import { useStats } from "@/hooks/useStats";
import { useWeeklyAttendance } from "@/hooks/useAulas";

const Index = () => {
  const [isNewStudentDialogOpen, setIsNewStudentDialogOpen] = useState(false);
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: attendanceData = [], isLoading: attendanceLoading } = useWeeklyAttendance();
  const addStudentMutation = useAddStudent();

  const handleAddStudent = (data: any) => {
    addStudentMutation.mutate({
      nome: data.name,
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@exemplo.com`,
      telefone: data.phone,
      faixa: data.belt,
    });
    setIsNewStudentDialogOpen(false);
  };

  // Transform students data for components
  const transformedStudents = students.map(student => ({
    id: student.id,
    name: student.nome,
    email: student.email,
    phone: student.telefone || "",
    belt: student.faixa_key || "branca",
    beltLabel: student.faixa_label,
    beltColor: student.faixa_color,
    joinDate: student.alunos?.data_inicio || student.created_at,
    photoUrl: student.foto_url,
  }));

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu gerenciador de academia de Jiu-Jitsu.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsNewStudentDialogOpen(true)}>
            <UserRoundPlus className="mr-2 h-4 w-4" />
            Novo Aluno
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/cadastro'}>
            Cadastrar Usuário
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Novos Alunos Este Mês" 
          value={statsLoading ? "..." : stats?.newStudentsThisMonth || 0}
          description="Alunos cadastrados este mês"
          icon={UserRoundPlus}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Alunos Ativos" 
          value={statsLoading ? "..." : stats?.totalStudents || 0}
          description="Total de alunos matriculados"
          icon={Users}
        />
        <StatCard 
          title="Aulas Esta Semana" 
          value={statsLoading ? "..." : stats?.totalClasses || 0}
          description="Total de aulas programadas"
          icon={CalendarDays}
        />
        <StatCard 
          title="Taxa de Presença" 
          value={statsLoading ? "..." : stats?.attendanceRate || "0%"}
          description="Média da semana"
          icon={Users}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard 
          title="Próxima Graduação" 
          value={statsLoading ? "..." : stats?.nextGraduation || "N/A"}
          description="Até o exame de faixa"
          icon={Award}
        />
      </div>

      <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-7">
        <AttendanceChart data={attendanceLoading ? [] : attendanceData} />
        {!studentsLoading && transformedStudents.length > 0 ? (
          <RecentStudents students={transformedStudents} />
        ) : (
          <div className="col-span-4 md:col-span-2">
            <EmptyStateCard
              icon={Users}
              title={studentsLoading ? "Carregando..." : "Sem alunos"}
              description={studentsLoading ? "Buscando alunos..." : "Você ainda não tem alunos cadastrados em sua academia."}
              actionLabel="Adicionar aluno"
              onAction={() => setIsNewStudentDialogOpen(true)}
            />
          </div>
        )}
      </div>
      
      <StudentForm 
        open={isNewStudentDialogOpen} 
        onOpenChange={setIsNewStudentDialogOpen} 
        onSubmit={handleAddStudent}
      />
    </AppLayout>
  );
};

export default Index;
