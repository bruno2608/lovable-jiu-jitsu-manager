
import { StudentCard, StudentProps } from "./StudentCard";

interface StudentListProps {
  students: StudentProps[];
}

export function StudentList({ students }: StudentListProps) {
  return (
    <div className="space-y-4">
      {students.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
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
