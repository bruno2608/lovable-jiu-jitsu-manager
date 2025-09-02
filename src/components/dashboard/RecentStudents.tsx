
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

  const getBeltClass = (beltColor?: string) => {
    if (beltColor) {
      return beltColor === '#ffffff' ? 'bg-white border-2 border-gray-300' : `bg-[${beltColor}]`;
    }
    return 'bg-white border-2 border-gray-300';
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
                 <div className="flex items-center gap-2">
                   <p className="text-sm text-muted-foreground">
                     Desde {new Date(student.joinDate).toLocaleDateString('pt-BR')}
                   </p>
                   <span className="text-xs text-muted-foreground">•</span>
                   <span className="text-xs font-medium">
                     {student.beltLabel || student.belt}
                   </span>
                 </div>
               </div>
               <div className={`ml-auto h-4 w-4 rounded-full ${getBeltClass(student.beltColor)}`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
