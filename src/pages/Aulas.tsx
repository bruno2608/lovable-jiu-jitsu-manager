
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus } from "lucide-react";
import { EmptyStateCard } from "@/components/EmptyStateCard";

const AulasPage = () => {
  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aulas</h1>
          <p className="text-muted-foreground">
            Gerencie as aulas e controle a presença dos alunos.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Aula
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <EmptyStateCard
          icon={CalendarDays}
          title="Nenhuma aula cadastrada"
          description="Você ainda não tem aulas cadastradas. Adicione uma nova aula para começar."
          actionLabel="Adicionar aula"
          onAction={() => alert("Funcionalidade de adicionar aula será implementada na versão 0.2")}
        />
      </div>
    </AppLayout>
  );
};

export default AulasPage;
