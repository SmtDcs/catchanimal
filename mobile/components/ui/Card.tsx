import { View, TouchableOpacity, ViewStyle } from "react-native";
import { cn } from "../../lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({ children, className, style, onPress }: CardProps) {
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component
      onPress={onPress}
      style={style}
      className={cn(
        "bg-card-bg border border-card-border rounded-2xl p-4 shadow-sm",
        className
      )}
    >
      {children}
    </Component>
  );
}
