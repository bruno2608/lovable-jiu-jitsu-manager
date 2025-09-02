
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Phone } from "lucide-react";

export interface StudentProps {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  belt: string;
  beltLabel?: string;
  beltColor?: string;
  joinDate: string;
  photoUrl?: string;
  active?: boolean;
  matricula?: number;
  matriculaDate?: string;
}

export function StudentCard({ name, email, phone, belt, beltLabel, beltColor, joinDate, photoUrl, active, matricula }: StudentProps) {
  const getBeltClass = (beltColor?: string) => {
    if (beltColor) {
      return beltColor === '#ffffff' ? 'bg-white border border-gray-300' : `bg-[${beltColor}]`;
    }
    // Fallback
    switch (belt?.toLowerCase()) {
      case "branca": return "bg-white border border-gray-300";
      case "azul": return "bg-blue-500";
      case "roxa": return "bg-purple-500";
      case "marrom": return "bg-amber-800";
      case "preta": return "bg-black";
      case "coral": return "bg-orange-400";
      default: return "bg-white border border-gray-300";
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
    <Card className={`overflow-hidden transition-all hover:shadow-md ${active === false ? 'opacity-60' : ''}`}>
      <CardHeader className="p-0">
        <div className={`h-2 ${getBeltClass(beltColor)}`}></div>
      </CardHeader>
      <CardContent className="pt-4 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={photoUrl} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{name}</p>
              {active === false && (
                <Badge variant="secondary" className="text-xs">Inativo</Badge>
              )}
              {matricula && (
                <Badge variant="outline" className="text-xs">#{matricula}</Badge>
              )}
            </div>
            {email && (
              <p className="text-sm text-muted-foreground truncate">{email}</p>
            )}
            {phone && (
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Phone className="mr-1 h-3 w-3" />
                {phone}
              </div>
            )}
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs ml-auto ${getBeltClass(beltColor)} ${
              beltColor === '#ffffff' || beltColor === '#ECC94B' ? 'text-black' : 'text-white'
            }`}
          >
            {beltLabel || belt}
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
