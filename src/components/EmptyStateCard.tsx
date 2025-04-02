
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, Plus } from "lucide-react";

interface EmptyStateCardProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction
}: EmptyStateCardProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        {Icon && (
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-full bg-muted">
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        )}
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        {actionHref ? (
          <Button asChild>
            <a href={actionHref}>
              <Plus className="mr-2 h-4 w-4" />
              {actionLabel}
            </a>
          </Button>
        ) : (
          <Button onClick={onAction}>
            <Plus className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
