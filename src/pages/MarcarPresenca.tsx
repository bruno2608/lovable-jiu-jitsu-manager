import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Check, Upload, Save, Search, Filter, UserCheck, UserX, 
  AlertCircle, RotateCcw, CheckCircle2, Clock, Users2,
  Zap, Camera, FileText
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { usePresencas, useAlunosTurma, useSavePresencas, useImportExcel } from "@/hooks/usePresencas";

export interface PresencaForm {
  aluno_id: string;
  status: "presente" | "ausente" | "justificado" | "";
  observacao: string;
  checked: boolean;
}

const MarcarPresenca = () => {
  const [searchParams] = useSearchParams();
  const aulaInstanciaId = searchParams.get("aula_instancia_id");
  
  const [presencas, setPresencas] = useState<PresencaForm[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showQuickActions, setShowQuickActions] = useState(true);

  const { data: alunos = [], isLoading: alunosLoading } = useAlunosTurma(aulaInstanciaId || "");
  const { data: presencasExistentes } = usePresencas(aulaInstanciaId || "");
  const savePresencasMutation = useSavePresencas();
  const importExcelMutation = useImportExcel();

  // Initialize presencas form when alunos are loaded
  useEffect(() => {
    if (alunos.length > 0) {
      const initialPresencas = alunos.map((aluno) => {
        const existente = presencasExistentes?.find(p => p.aluno_id === aluno.id);
        const status = existente?.status;
        const validStatus = status === "presente" || status === "ausente" || status === "justificado" ? status : "";
        
        return {
          aluno_id: aluno.id,
          status: validStatus as PresencaForm["status"],
          observacao: existente?.observacao || "",
          checked: !!existente,
        };
      });
      setPresencas(initialPresencas);
    }
  }, [alunos, presencasExistentes]);

  const handlePresencaChange = (index: number, field: keyof PresencaForm, value: any) => {
    setPresencas(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      // Auto-check when status is selected
      if (field === "status" && value) {
        updated[index].checked = true;
      }
      
      // Clear observacao if not justificado
      if (field === "status" && value !== "justificado") {
        updated[index].observacao = "";
      }
      
      return updated;
    });
  };

  const handleSavePresencas = async () => {
    const presencasParaSalvar = presencas.filter(p => p.checked && p.status);
    
    if (presencasParaSalvar.length === 0) {
      toast.error("Marque pelo menos uma presença antes de salvar.");
      return;
    }

    try {
      await savePresencasMutation.mutateAsync({
        aula_instancia_id: aulaInstanciaId!,
        presencas: presencasParaSalvar.map(p => ({
          aluno_id: p.aluno_id,
          status: p.status,
          observacao: p.observacao,
        })),
      });
      
      toast.success("Presenças salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar presenças");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile);
    } else {
      toast.error("Por favor, selecione um arquivo Excel (.xlsx)");
    }
  };

  const handleImportExcel = async () => {
    if (!file || !aulaInstanciaId) {
      toast.error("Selecione um arquivo Excel antes de importar.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('aula_instancia_id', aulaInstanciaId);

      await importExcelMutation.mutateAsync(formData);
      
      toast.success("Presenças importadas com sucesso!");
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('excel-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      toast.error("Erro ao importar arquivo Excel");
    }
  };

  // Quick Actions
  const markAllPresent = () => {
    setPresencas(prev => prev.map(p => ({
      ...p,
      status: "presente" as PresencaForm["status"],
      checked: true,
      observacao: ""
    })));
    toast.success("Todos os alunos marcados como presentes");
  };

  const markAllAbsent = () => {
    setPresencas(prev => prev.map(p => ({
      ...p,
      status: "ausente" as PresencaForm["status"],
      checked: true,
      observacao: ""
    })));
    toast.success("Todos os alunos marcados como ausentes");
  };

  const clearAll = () => {
    setPresencas(prev => prev.map(p => ({
      ...p,
      status: "" as PresencaForm["status"],
      checked: false,
      observacao: ""
    })));
    toast.success("Todas as marcações removidas");
  };

  // Filter students
  const filteredAlunos = alunos.filter((aluno, index) => {
    const presenca = presencas[index];
    const matchesSearch = aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aluno.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "checked" && presenca?.checked) ||
                         (statusFilter === "unchecked" && !presenca?.checked) ||
                         (statusFilter === "presente" && presenca?.status === "presente") ||
                         (statusFilter === "ausente" && presenca?.status === "ausente") ||
                         (statusFilter === "justificado" && presenca?.status === "justificado");
    
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: presencas.length,
    checked: presencas.filter(p => p.checked).length,
    presente: presencas.filter(p => p.status === "presente").length,
    ausente: presencas.filter(p => p.status === "ausente").length,
    justificado: presencas.filter(p => p.status === "justificado").length,
  };

  if (!aulaInstanciaId) {
    return (
      <AppLayout>
        <div className="text-center py-8">
          <h2 className="text-lg font-semibold text-destructive">ID da aula não encontrado</h2>
          <p className="text-muted-foreground">Verifique o link e tente novamente.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marcar Presença</h1>
            <p className="text-muted-foreground">
              Registre a presença dos alunos na aula
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1">
              <Users2 className="h-3 w-3" />
              {stats.total} alunos
            </Badge>
            <Badge variant="outline" className="gap-1 text-green-600 border-green-200">
              <UserCheck className="h-3 w-3" />
              {stats.presente} presentes
            </Badge>
            <Badge variant="outline" className="gap-1 text-red-600 border-red-200">
              <UserX className="h-3 w-3" />
              {stats.ausente} ausentes
            </Badge>
            {stats.justificado > 0 && (
              <Badge variant="outline" className="gap-1 text-yellow-600 border-yellow-200">
                <AlertCircle className="h-3 w-3" />
                {stats.justificado} justificados
              </Badge>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="checked">Marcados</SelectItem>
                  <SelectItem value="unchecked">Não Marcados</SelectItem>
                  <Separator />
                  <SelectItem value="presente">Presentes</SelectItem>
                  <SelectItem value="ausente">Ausentes</SelectItem>
                  <SelectItem value="justificado">Justificados</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleSavePresencas}
                disabled={savePresencasMutation.isPending || stats.checked === 0}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar ({stats.checked})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {showQuickActions && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Ações Rápidas
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickActions(false)}
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllPresent}
                  className="gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Marcar Todos Presentes
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAbsent}
                  className="gap-2"
                >
                  <UserX className="h-4 w-4 text-red-600" />
                  Marcar Todos Ausentes
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Limpar Tudo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Import Excel Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importar Excel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="excel-file">Selecionar arquivo Excel (.xlsx)</Label>
                <input
                  id="excel-file"
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileUpload}
                  className="mt-1 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
              <Button
                onClick={handleImportExcel}
                disabled={!file || importExcelMutation.isPending}
                variant="outline"
              >
                {importExcelMutation.isPending ? "Importando..." : "Importar"}
              </Button>
            </div>
            
            {file && (
              <div className="text-sm text-muted-foreground">
                Arquivo selecionado: {file.name}
              </div>
            )}
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Formato esperado:</strong></p>
              <p>• Coluna A: aluno_id ou nome</p>
              <p>• Coluna B: status (presente/ausente/justificado)</p>
              <p>• Coluna C: observacao (opcional)</p>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Lista de Alunos
              <span className="text-sm font-normal text-muted-foreground">
                {filteredAlunos.length} de {alunos.length} alunos
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {alunosLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-8 w-32" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlunos.map((aluno, filteredIndex) => {
                    // Find the original index in the full alunos array
                    const originalIndex = alunos.findIndex(a => a.id === aluno.id);
                    const presenca = presencas[originalIndex];
                    if (!presenca) return null;

                    return (
                      <div key={aluno.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow">
                        <Checkbox
                          checked={presenca.checked}
                          onCheckedChange={(checked) => 
                            handlePresencaChange(originalIndex, "checked", checked)
                          }
                        />
                        
                        {/* Avatar */}
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={aluno.foto_url} alt={aluno.nome} />
                          <AvatarFallback>
                            {aluno.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{aluno.nome}</h3>
                              {presenca.status && (
                                <Badge 
                                  variant={
                                    presenca.status === "presente" ? "default" :
                                    presenca.status === "ausente" ? "destructive" : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {presenca.status === "presente" ? "Presente" :
                                   presenca.status === "ausente" ? "Ausente" : "Justificado"}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{aluno.email}</p>
                            {aluno.faixa_label && (
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                                style={{ 
                                  borderColor: aluno.faixa_color,
                                  color: aluno.faixa_color 
                                }}
                              >
                                {aluno.faixa_label}
                              </Badge>
                            )}
                          </div>
                          
                          {presenca.checked && (
                            <div className="space-y-3 pt-2">
                              <div>
                                <Label className="text-sm">Status</Label>
                                <Select
                                  value={presenca.status}
                                  onValueChange={(value) => 
                                    handlePresencaChange(originalIndex, "status", value)
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="presente">
                                      <div className="flex items-center gap-2">
                                        <UserCheck className="h-4 w-4 text-green-600" />
                                        Presente
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="ausente">
                                      <div className="flex items-center gap-2">
                                        <UserX className="h-4 w-4 text-red-600" />
                                        Ausente
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="justificado">
                                      <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                        Justificado
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {presenca.status === "justificado" && (
                                <div>
                                  <Label className="text-sm">Observação</Label>
                                  <Textarea
                                    placeholder="Motivo da justificativa..."
                                    value={presenca.observacao}
                                    onChange={(e) => 
                                      handlePresencaChange(originalIndex, "observacao", e.target.value)
                                    }
                                    className="mt-1"
                                    rows={2}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quick Status Buttons */}
                        {!presenca.checked && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                handlePresencaChange(originalIndex, "status", "presente");
                                handlePresencaChange(originalIndex, "checked", true);
                              }}
                              className="gap-1 text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <UserCheck className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                handlePresencaChange(originalIndex, "status", "ausente");
                                handlePresencaChange(originalIndex, "checked", true);
                              }}
                              className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <UserX className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {!alunosLoading && filteredAlunos.length === 0 && searchTerm && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhum aluno encontrado para "{searchTerm}".
                  </p>
                </div>
              )}
              
              {!alunosLoading && alunos.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum aluno encontrado para esta aula.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MarcarPresenca;