
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Phone } from "lucide-react";

export interface StudentProps {
  id: string;
  name: string;
  phone?: string;
  belt: "Branca" | "Azul" | "Roxa" | "Marrom" | "Preta" | "Coral";
  joinDate: string;
  photoUrl?: string;
}

export function StudentCard({ name, phone, belt, joinDate, photoUrl }: StudentProps) {
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

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className={`h-2 ${getBeltClass(belt)}`}></div>
      </CardHeader>
      <CardContent className="pt-4 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={photoUrl} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{name}</p>
            {phone && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-1 h-3 w-3" />
                {phone}
              </div>
            )}
          </div>
          <Badge variant="outline" className={`${getBeltClass(belt)} text-xs ml-auto`}>
            {belt}
          </Badge>
        </div>
        <div className="mt-3 flex items-center text-xs text-muted-foreground">
          <CalendarDays className="mr-1 h-3 w-3" />
          Desde {new Date(joinDate).toLocaleDateString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
}
