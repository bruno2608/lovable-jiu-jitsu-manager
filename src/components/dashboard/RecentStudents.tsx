
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentProps } from "../students/StudentCard";

interface RecentStudentsProps {
  students: StudentProps[];
}

export function RecentStudents({ students }: RecentStudentsProps) {
  // Get only the 5 most recent students
  const recentStudents = [...students]
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .slice(0, 5);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getBeltClass = (belt: string) => {
    switch (belt) {
      case "Branca": return "belt-white";
      case "Azul": return "belt-blue";
      case "Roxa": return "belt-purple";
      case "Marrom": return "belt-brown";
      case "Preta": return "belt-black";
      case "Coral": return "belt-coral";
      default: return "belt-white";
    }
  };

  return (
    <Card className="col-span-4 md:col-span-2">
      <CardHeader>
        <CardTitle>Novos Alunos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentStudents.map((student) => (
            <div key={student.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={student.photoUrl} />
                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{student.name}</p>
                <p className="text-sm text-muted-foreground">
                  Desde {new Date(student.joinDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className={`ml-auto h-4 w-4 rounded-full ${getBeltClass(student.belt)}`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
