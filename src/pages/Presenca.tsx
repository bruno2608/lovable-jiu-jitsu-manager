import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CheckSquare, 
  Calendar, 
  Users, 
  Clock, 
  Search,
  Filter,
  Plus,
  BarChart3,
  UserCheck,
  UserX,
  AlertCircle
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateCard } from "@/components/EmptyStateCard";
import { useAulas } from "@/hooks/useAulas";

interface ClassInstance {
  id: string;
  data: string;
  status: string;
  aula: {
    id: string;
    nome: string;
    tipo: string;
    horario_inicio: string;
    horario_fim: string;
    usuarios?: { nome: string };
    turmas?: { nome: string };
  };
  total_alunos: number;
  presentes: number;
  ausentes: number;
  justificados: number;
}

const Presenca = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("today");
  
  const { data: aulas = [], isLoading } = useAulas();

  // Mock data for today's classes - in a real app, this would come from an API
  const mockTodayClasses: ClassInstance[] = [
    {
      id: "1",
      data: new Date().toISOString().split('T')[0],
      status: "Programada",
      aula: {
        id: "aula-1",
        nome: "Jiu-Jitsu Fundamentals",
        tipo: "Gi",
        horario_inicio: "07:00:00",
        horario_fim: "08:30:00",
        usuarios: { nome: "Prof. João Silva" },
        turmas: { nome: "Iniciantes" }
      },
      total_alunos: 15,
      presentes: 12,
      ausentes: 2,
      justificados: 1
    },
    {
      id: "2",
      data: new Date().toISOString().split('T')[0],
      status: "Em Andamento",
      aula: {
        id: "aula-2",
        nome: "No-Gi Advanced",
        tipo: "No-Gi",
        horario_inicio: "18:30:00",
        horario_fim: "20:00:00",
        usuarios: { nome: "Prof. Maria Santos" },
        turmas: { nome: "Avançados" }
      },
      total_alunos: 20,
      presentes: 18,
      ausentes: 1,
      justificados: 1
    },
    {
      id: "3",
      data: new Date().toISOString().split('T')[0],
      status: "Finalizada",
      aula: {
        id: "aula-3",
        nome: "Kids BJJ",
        tipo: "Infantil",
        horario_inicio: "16:00:00",
        horario_fim: "17:00:00",
        usuarios: { nome: "Prof. Carlos Lima" },
        turmas: { nome: "Infantil" }
      },
      total_alunos: 12,
      presentes: 10,
      ausentes: 2,
      justificados: 0
    }
  ];

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "programada": return "default";
      case "em andamento": return "secondary";
      case "finalizada": return "outline";
      default: return "default";
    }
  };

  const getAttendanceRate = (presente: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((presente / total) * 100);
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredClasses = mockTodayClasses.filter(classItem => {
    const matchesSearch = classItem.aula.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.aula.usuarios?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.aula.turmas?.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || classItem.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const todayStats = {
    totalClasses: mockTodayClasses.length,
    totalStudents: mockTodayClasses.reduce((sum, c) => sum + c.total_alunos, 0),
    totalPresent: mockTodayClasses.reduce((sum, c) => sum + c.presentes, 0),
    totalAbsent: mockTodayClasses.reduce((sum, c) => sum + c.ausentes, 0),
    averageAttendance: mockTodayClasses.length > 0 
      ? Math.round(mockTodayClasses.reduce((sum, c) => sum + getAttendanceRate(c.presentes, c.total_alunos), 0) / mockTodayClasses.length)
      : 0
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-9 w-48 mb-2" />
              <Skeleton className="h-5 w-80" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-12 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Controle de Presença</h1>
            <p className="text-muted-foreground">
              Gerencie a presença dos alunos nas aulas de hoje
            </p>
          </div>
          
          <Link to="/marcar-presenca">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Marcar Presença
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aulas Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.totalClasses}</div>
              <p className="text-xs text-muted-foreground">
                aulas programadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alunos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                total matriculados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presentes</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{todayStats.totalPresent}</div>
              <p className="text-xs text-muted-foreground">
                de {todayStats.totalStudents} alunos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Presença</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getAttendanceColor(todayStats.averageAttendance)}`}>
                {todayStats.averageAttendance}%
              </div>
              <p className="text-xs text-muted-foreground">
                média do dia
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Aulas de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por aula, instrutor ou turma..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="programada">Programada</SelectItem>
                  <SelectItem value="em andamento">Em Andamento</SelectItem>
                  <SelectItem value="finalizada">Finalizada</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="yesterday">Ontem</SelectItem>
                  <SelectItem value="this-week">Esta Semana</SelectItem>
                  <SelectItem value="last-week">Semana Passada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Classes List */}
            {filteredClasses.length > 0 ? (
              <div className="space-y-4">
                {filteredClasses.map((classItem) => {
                  const attendanceRate = getAttendanceRate(classItem.presentes, classItem.total_alunos);
                  
                  return (
                    <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{classItem.aula.nome}</h3>
                              <Badge variant={getStatusColor(classItem.status)}>
                                {classItem.status}
                              </Badge>
                              <Badge variant="outline">{classItem.aula.tipo}</Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatTime(classItem.aula.horario_inicio)} - {formatTime(classItem.aula.horario_fim)}
                              </div>
                              
                              {classItem.aula.usuarios && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {classItem.aula.usuarios.nome}
                                </div>
                              )}
                              
                              {classItem.aula.turmas && (
                                <span>Turma: {classItem.aula.turmas.nome}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Attendance Summary */}
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-green-600">
                                <UserCheck className="h-4 w-4" />
                                <span className="font-medium">{classItem.presentes}</span>
                              </div>
                              
                              <div className="flex items-center gap-1 text-red-600">
                                <UserX className="h-4 w-4" />
                                <span className="font-medium">{classItem.ausentes}</span>
                              </div>
                              
                              {classItem.justificados > 0 && (
                                <div className="flex items-center gap-1 text-yellow-600">
                                  <AlertCircle className="h-4 w-4" />
                                  <span className="font-medium">{classItem.justificados}</span>
                                </div>
                              )}

                              <div className={`font-semibold ${getAttendanceColor(attendanceRate)}`}>
                                {attendanceRate}%
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Link to={`/marcar-presenca?aula_instancia_id=${classItem.id}`}>
                                <Button variant="outline" size="sm">
                                  <CheckSquare className="h-4 w-4 mr-1" />
                                  Presença
                                </Button>
                              </Link>
                              
                              <Button variant="ghost" size="sm">
                                Ver Detalhes
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <EmptyStateCard
                icon={CheckSquare}
                title="Nenhuma aula encontrada"
                description="Não há aulas programadas para os filtros selecionados."
                actionLabel="Ver todas as aulas"
                onAction={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("today");
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Presenca;