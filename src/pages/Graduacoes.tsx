import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Plus, Calendar, User } from "lucide-react";
import { EmptyStateCard } from "@/components/EmptyStateCard";
import { useUpcomingGraduacoes } from "@/hooks/useGraduacoes";

const GraduacoesPage = () => {
  const { data: graduacoes = [], isLoading } = useUpcomingGraduacoes();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmada":
      case "aprovada":
        return "default";
      case "pendente":
        return "secondary";
      case "rejeitada":
      case "cancelada":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Graduações</h1>
            <p className="text-muted-foreground">
              Acompanhe as próximas graduações e cerimônias de faixa.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Graduação
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Graduações</h1>
          <p className="text-muted-foreground">
            Acompanhe as próximas graduações e cerimônias de faixa.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Graduação
        </Button>
      </div>

      {graduacoes.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {graduacoes.map((graduacao) => (
            <Card key={graduacao.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {graduacao.usuarios?.nome || "Nome não informado"}
                  </CardTitle>
                  <Badge variant={getStatusColor(graduacao.status)}>
                    {graduacao.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {graduacao.usuarios?.email}
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Data: {formatDate(graduacao.data_graduacao)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4" />
                  <span>
                    Grau {graduacao.grau_anterior || 0} → {graduacao.grau_novo}
                  </span>
                </div>
                {graduacao.professor && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>Professor: {graduacao.professor.nome}</span>
                  </div>
                )}
                {graduacao.observacoes && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Observações:</strong> {graduacao.observacoes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyStateCard
          icon={Award}
          title="Nenhuma graduação programada"
          description="Não há graduações programadas para os próximos dias."
          actionLabel="Programar graduação"
          onAction={() => alert("Funcionalidade de programar graduação será implementada na versão 0.2")}
        />
      )}
    </AppLayout>
  );
};

export default GraduacoesPage;