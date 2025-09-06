import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Upload, Save } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marcar Presença</h1>
            <p className="text-muted-foreground">
              Registre a presença dos alunos na aula
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleSavePresencas}
              disabled={savePresencasMutation.isPending || presencas.filter(p => p.checked).length === 0}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar Presenças
            </Button>
          </div>
        </div>

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
            <CardTitle>Lista de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {alunosLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Skeleton className="h-4 w-4" />
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
                  {alunos.map((aluno, index) => {
                    const presenca = presencas[index];
                    if (!presenca) return null;

                    return (
                      <div key={aluno.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <Checkbox
                          checked={presenca.checked}
                          onCheckedChange={(checked) => 
                            handlePresencaChange(index, "checked", checked)
                          }
                        />
                        
                        <div className="flex-1 space-y-2">
                          <div>
                            <h3 className="font-medium">{aluno.nome}</h3>
                            <p className="text-sm text-muted-foreground">{aluno.email}</p>
                            {aluno.faixa_label && (
                              <Badge 
                                variant="outline" 
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
                            <div className="space-y-3">
                              <div>
                                <Label className="text-sm">Status</Label>
                                <Select
                                  value={presenca.status}
                                  onValueChange={(value) => 
                                    handlePresencaChange(index, "status", value)
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="presente">Presente</SelectItem>
                                    <SelectItem value="ausente">Ausente</SelectItem>
                                    <SelectItem value="justificado">Justificado</SelectItem>
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
                                      handlePresencaChange(index, "observacao", e.target.value)
                                    }
                                    className="mt-1"
                                    rows={2}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
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