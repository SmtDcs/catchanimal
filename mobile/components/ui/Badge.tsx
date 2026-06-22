import { View, Text } from "react-native";
import { cn } from "../../lib/utils";

interface BadgeProps {
  label: string;
  variant?: "rarity" | "species" | "level";
  className?: string;
}

const speciesBg = "bg-wood-light";
const levelBg = "bg-primary-light";

const rarityBg: Record<string, string> = {
  Common: "bg-[#A8B5A0]",
  Uncommon: "bg-success",
  Rare: "bg-[#85C1E8]",
  Epic: "bg-[#C9A8E8]",
  Legendary: "bg-coin",
};

export function Badge({ label, variant = "species", className }: BadgeProps) {
  const bgClass =
    variant === "rarity" && rarityBg[label]
      ? rarityBg[label]
      : variant === "level"
        ? levelBg
        : speciesBg;

  return (
    <View className={cn("px-3 py-1 rounded-full self-start", bgClass, className)}>
      <Text className="text-xs font-body text-text-primary text-center">
        {label}
      </Text>
    </View>
  );
}
