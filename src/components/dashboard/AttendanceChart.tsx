
import { 
  Bar,
  BarChart as RechartBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AttendanceChartProps {
  data: { 
    name: string;
    total: number;
  }[];
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Frequência de Alunos</CardTitle>
        <CardDescription>
          Número de alunos presentes por dia nos últimos 7 dias
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <RechartBarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Bar
              dataKey="total"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </RechartBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
