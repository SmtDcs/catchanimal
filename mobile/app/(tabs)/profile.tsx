import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../components/ui/Card";
import { useStore } from "../../lib/store";

const RARITY_LABELS = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

export default function ProfileScreen() {
  const player = useStore((s) => s.player);
  const collection = useStore((s) => s.collection);

  const rarityCount = collection.reduce(
    (acc, a) => {
      const label = RARITY_LABELS[a.stats.rarity - 1];
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const xpProgress = (player.xp % 100) / 100;

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-6 pt-4 pb-2">
        <Text className="font-display text-3xl text-text-primary">Profil</Text>
      </View>

      <View className="px-6 gap-4">
        {/* Level card */}
        <Card>
          <Text className="font-display text-lg text-text-primary">
            Seviye {player.level}
          </Text>
          <View className="h-2 bg-card-border rounded-full mt-2 overflow-hidden">
            <View
              style={{ width: `${xpProgress * 100}%` }}
              className="h-full bg-primary rounded-full"
            />
          </View>
          <Text className="font-body text-xs text-text-secondary mt-1">
            {player.xp % 100} / 100 XP
          </Text>
        </Card>

        {/* Stats */}
        <Card>
          <Text className="font-display text-base text-text-primary mb-2">
            İstatistikler
          </Text>
          <View className="flex-row justify-between">
            <StatItem
              icon="paw"
              label="Yakalama"
              value={player.catches}
            />
            <StatItem
              icon="star"
              label="Koleksiyon"
              value={collection.length}
            />
            <StatItem icon="cash" label="Coin" value={player.coins} />
          </View>
        </Card>

        {/* Rarity breakdown */}
        {Object.keys(rarityCount).length > 0 && (
          <Card>
            <Text className="font-display text-base text-text-primary mb-2">
              Nadirlik Dağılımı
            </Text>
            {Object.entries(rarityCount).map(([label, count]) => (
              <View key={label} className="flex-row justify-between py-1">
                <Text className="font-body text-sm text-text-secondary">
                  {label}
                </Text>
                <Text className="font-body text-sm text-text-primary">
                  {count}
                </Text>
              </View>
            ))}
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <View className="items-center">
      <Ionicons name={icon as any} size={24} color="#C4956A" />
      <Text className="font-display text-lg text-text-primary mt-1">
        {value}
      </Text>
      <Text className="font-body text-xs text-text-secondary">{label}</Text>
    </View>
  );
}
