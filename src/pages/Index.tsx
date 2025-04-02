
import { useState } from "react";
import { Users, CalendarDays, Award, UserRoundPlus } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard"; 
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { RecentStudents } from "@/components/dashboard/RecentStudents";
import { StudentProps } from "@/components/students/StudentCard";
import { Button } from "@/components/ui/button";
import { StudentForm } from "@/components/students/StudentForm";
import { EmptyStateCard } from "@/components/EmptyStateCard";

// Example data
const mockStudents: StudentProps[] = [
  {
    id: "1",
    name: "João Silva",
    phone: "(11) 98765-4321",
    belt: "Azul",
    joinDate: "2023-01-15",
  },
  {
    id: "2", 
    name: "Maria Oliveira",
    phone: "(11) 91234-5678",
    belt: "Roxa",
    joinDate: "2022-05-20",
  },
  {
    id: "3",
    name: "Carlos Santos",
    phone: "(21) 99876-5432",
    belt: "Branca",
    joinDate: "2023-09-10",
  },
  {
    id: "4",
    name: "Ana Pereira",
    phone: "(11) 95555-4444",
    belt: "Preta",
    joinDate: "2019-03-22",
  },
  {
    id: "5",
    name: "Lucas Mendes",
    phone: "(21) 94444-3333",
    belt: "Marrom",
    joinDate: "2020-11-05",
  }
];

const attendanceData = [
  { name: "Seg", total: 18 },
  { name: "Ter", total: 22 },
  { name: "Qua", total: 15 },
  { name: "Qui", total: 24 },
  { name: "Sex", total: 20 },
  { name: "Sáb", total: 14 },
  { name: "Dom", total: 0 },
];

const Index = () => {
  const [isNewStudentDialogOpen, setIsNewStudentDialogOpen] = useState(false);
  const [students, setStudents] = useState<StudentProps[]>(mockStudents);

  const handleAddStudent = (data: any) => {
    const newStudent: StudentProps = {
      id: (students.length + 1).toString(),
      name: data.name,
      phone: data.phone,
      belt: data.belt,
      joinDate: new Date().toISOString().split('T')[0],
    };

    setStudents([...students, newStudent]);
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu gerenciador de academia de Jiu-Jitsu.
          </p>
        </div>
        <Button onClick={() => setIsNewStudentDialogOpen(true)}>
          <UserRoundPlus className="mr-2 h-4 w-4" />
          Novo Aluno
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Alunos Ativos" 
          value={students.length}
          description="Total de alunos matriculados"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Aulas Esta Semana" 
          value="15" 
          description="Total de aulas programadas"
          icon={CalendarDays}
        />
        <StatCard 
          title="Taxa de Presença" 
          value="78%" 
          description="Média da semana"
          icon={Users}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard 
          title="Próxima Graduação" 
          value="18 dias" 
          description="Até o exame de faixa"
          icon={Award}
        />
      </div>

      <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-7">
        <AttendanceChart data={attendanceData} />
        {students.length > 0 ? (
          <RecentStudents students={students} />
        ) : (
          <div className="col-span-4 md:col-span-2">
            <EmptyStateCard
              icon={Users}
              title="Sem alunos"
              description="Você ainda não tem alunos cadastrados em sua academia."
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
