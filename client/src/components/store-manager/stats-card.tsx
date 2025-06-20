import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency, calculatePercentageChange } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  previousValue: number;
  suffix?: string;
  info?: string;
}

const StatsCard = ({ title, value, previousValue, suffix, info }: StatsCardProps) => {
  const percentageChange = calculatePercentageChange(value, previousValue);
  const isPositive = percentageChange >= 0;
  
  // Determine if positive change is good or bad based on the title
  const isPositiveGood = !title.toLowerCase().includes('waste');
  
  // For waste, positive change is bad, negative is good
  const statusColor = isPositiveGood 
    ? (isPositive ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500')
    : (isPositive ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500');
  
  const formattedValue = suffix === '$' 
    ? formatCurrency(value)
    : `${value}${suffix ? ` ${suffix}` : ''}`;
  
  const formattedPreviousValue = suffix === '$' 
    ? formatCurrency(previousValue)
    : `${previousValue}${suffix ? ` ${suffix}` : ''}`;

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <span className={cn("text-xs px-2 py-1 rounded-full", statusColor)}>
            {isPositive ? '+' : ''}{percentageChange}%
          </span>
        </div>
        <p className="text-2xl font-semibold text-gray-800">{formattedValue}</p>
        <p className="text-xs text-gray-500">
          vs {formattedPreviousValue} {info}
        </p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
