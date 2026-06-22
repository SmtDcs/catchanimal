import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from "react-native";
import { cn } from "../../lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: ViewStyle;
}

export function Button({
  children,
  onPress,
  variant = "primary",
  disabled,
  loading,
  className,
  style,
}: ButtonProps) {
  const variants = {
    primary: "bg-primary active:bg-primary-dark",
    secondary: "bg-wood active:bg-wood-dark",
    outline: "border border-primary bg-transparent",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
      className={cn(
        "px-6 py-3 rounded-full flex-row items-center justify-center gap-2",
        variants[variant],
        disabled && "opacity-50",
        className
      )}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#E8A87C" : "#FFF"} />
      ) : (
        <Text
          className={cn(
            "font-display text-base",
            variant === "outline" ? "text-primary" : "text-white"
          )}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
