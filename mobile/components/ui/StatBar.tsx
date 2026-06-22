import { View, Text } from "react-native";
import { cn } from "../../lib/utils";

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
  className?: string;
}

export function StatBar({
  label,
  value,
  maxValue = 100,
  color = "#A8D5BA",
  className,
}: StatBarProps) {
  const pct = Math.min((value / maxValue) * 100, 100);

  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <Text className="w-8 text-xs font-body text-text-secondary">{label}</Text>
      <View className="flex-1 h-3 bg-card-border rounded-full overflow-hidden">
        <View
          style={{ width: `${pct}%`, backgroundColor: color }}
          className="h-full rounded-full"
        />
      </View>
      <Text className="w-8 text-xs font-body text-text-primary text-right">
        {value}
      </Text>
    </View>
  );
}
