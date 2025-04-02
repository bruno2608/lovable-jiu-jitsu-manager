
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { StudentList } from "@/components/students/StudentList";
import { StudentProps } from "@/components/students/StudentCard";
import { StudentForm } from "@/components/students/StudentForm";
import { UserRoundPlus, Users } from "lucide-react";
import { EmptyStateCard } from "@/components/EmptyStateCard";

// Mock students data
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

const AlunosPage = () => {
  const [students, setStudents] = useState<StudentProps[]>(mockStudents);
  const [isNewStudentDialogOpen, setIsNewStudentDialogOpen] = useState(false);

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
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie seus alunos e acompanhe seu progresso.
          </p>
        </div>
        <Button onClick={() => setIsNewStudentDialogOpen(true)}>
          <UserRoundPlus className="mr-2 h-4 w-4" />
          Novo Aluno
        </Button>
      </div>

      {students.length > 0 ? (
        <StudentList students={students} />
      ) : (
        <EmptyStateCard
          icon={Users}
          title="Nenhum aluno cadastrado"
          description="Você ainda não tem alunos cadastrados em sua academia."
          actionLabel="Adicionar aluno"
          onAction={() => setIsNewStudentDialogOpen(true)}
        />
      )}

      <StudentForm
        open={isNewStudentDialogOpen}
        onOpenChange={setIsNewStudentDialogOpen}
        onSubmit={handleAddStudent}
      />
    </AppLayout>
  );
};

export default AlunosPage;
