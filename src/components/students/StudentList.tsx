
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { StudentCard, StudentProps } from "./StudentCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface StudentListProps {
  students: StudentProps[];
}

export function StudentList({ students }: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [beltFilter, setBeltFilter] = useState<string>("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBelt = beltFilter === "all" || student.belt === beltFilter;
    return matchesSearch && matchesBelt;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar aluno..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={beltFilter} onValueChange={setBeltFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por faixa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as faixas</SelectItem>
            <SelectItem value="Branca">Branca</SelectItem>
            <SelectItem value="Azul">Azul</SelectItem>
            <SelectItem value="Roxa">Roxa</SelectItem>
            <SelectItem value="Marrom">Marrom</SelectItem>
            <SelectItem value="Preta">Preta</SelectItem>
            <SelectItem value="Coral">Coral</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} {...student} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum aluno encontrado.</p>
        </div>
      )}
    </div>
  );
}
