
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentList } from "@/components/students/StudentList";
import { StudentForm } from "@/components/students/StudentForm";
import { UserRoundPlus, Users } from "lucide-react";
import { EmptyStateCard } from "@/components/EmptyStateCard";
import { useStudents, useAddStudent } from "@/hooks/useStudents";

const AlunosPage = () => {
  const [isNewStudentDialogOpen, setIsNewStudentDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: students = [], isLoading } = useStudents(searchTerm, statusFilter === "all" ? undefined : statusFilter);
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
    belt: (student.alunos?.faixa || "Branca") as "Branca" | "Azul" | "Roxa" | "Marrom" | "Preta" | "Coral",
    joinDate: student.alunos?.data_inicio || student.created_at,
    photoUrl: student.foto_url,
    active: student.ativo,
    matricula: student.matriculas?.[0]?.numero || 0,
    matriculaDate: student.matriculas?.[0]?.created_at || student.created_at,
  }));

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

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="inativo">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isLoading && transformedStudents.length > 0 ? (
        <StudentList students={transformedStudents} />
      ) : (
        <EmptyStateCard
          icon={Users}
          title={isLoading ? "Carregando..." : searchTerm || statusFilter !== "all" ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado"}
          description={isLoading ? "Buscando alunos..." : searchTerm || statusFilter !== "all" ? "Tente ajustar os filtros de busca." : "Você ainda não tem alunos cadastrados em sua academia."}
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
