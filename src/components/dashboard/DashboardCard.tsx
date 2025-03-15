import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    label: string;
    isPositive?: boolean;
  };
  additionalInfo?: string;
}

export const DashboardCard = ({
  title,
  value,
  icon: Icon,
  trend,
  additionalInfo
}: DashboardCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{value}</div>
          <div className="p-2 bg-dental-100 rounded-full text-dental-600">
            <Icon size={20} />
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {trend && (
            <span className={`${trend.isPositive ? 'text-green-500' : 'text-dental-600'} font-medium`}>
              {trend.value}
            </span>
          )}
          {trend?.label && ` ${trend.label}`}
          {additionalInfo && additionalInfo}
        </div>
      </CardContent>
    </Card>
  );
}; 