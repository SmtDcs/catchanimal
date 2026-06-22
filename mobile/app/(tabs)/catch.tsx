import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "../../components/CameraView";
import { useStore, type Animal } from "../../lib/store";
import { getSpeciesEmoji, getSpeciesLabel } from "../../lib/animals";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

const RARITY_LABELS = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

export default function CatchScreen() {
  const player = useStore((s) => s.player);
  const [showCamera, setShowCamera] = useState(false);
  const [lastCatch, setLastCatch] = useState<Animal | null>(null);

  const handleCatch = (animal: Animal) => {
    setLastCatch(animal);
    // Kamera açık kalsın, kullanıcı devam edebilsin
  };

  if (showCamera) {
    return (
      <CameraView
        onCatch={handleCatch}
        onClose={() => {
          setShowCamera(false);
          // Çıkışta son yakalamayı 3sn göster sonra temizle
          setTimeout(() => setLastCatch(null), 3000);
        }}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-6 pt-4 pb-2">
        <Text className="font-display text-3xl text-text-primary">CatchCat</Text>
        <Text className="font-body text-sm text-text-secondary">
          Kameranı aç, hayvanları yakala!
        </Text>
      </View>

      {/* Last catch card */}
      {lastCatch && (
        <View className="px-6 mb-3">
          <Card className="flex-row items-center gap-4">
            <Text className="text-4xl">{getSpeciesEmoji(lastCatch.species)}</Text>
            <View className="flex-1">
              <Text className="font-display text-base text-text-primary">
                {lastCatch.funnyName}
              </Text>
              <Text className="font-body text-xs text-text-secondary">
                {getSpeciesLabel(lastCatch.species)} • {lastCatch.breedVariant}
              </Text>
              <View className="flex-row gap-2 mt-1">
                <Badge
                  label={RARITY_LABELS[lastCatch.stats.rarity - 1]}
                  variant="rarity"
                />
                <Badge label={`Lv.${lastCatch.level}`} variant="level" />
              </View>
            </View>
          </Card>
        </View>
      )}

      {/* Camera placeholder */}
      <View className="flex-1 mx-4">
        <Card
          onPress={() => setShowCamera(true)}
          className="flex-1 items-center justify-center"
          style={{ minHeight: 300 }}
        >
          <View className="w-20 h-20 bg-wood-light rounded-full items-center justify-center mb-4">
            <Ionicons name="camera-outline" size={40} color="#C4956A" />
          </View>
          <Text className="font-display text-xl text-text-primary">
            Kamerayı Aç
          </Text>
          <Text className="font-body text-sm text-text-secondary text-center mt-2 max-w-xs">
            Gerçek hayvanları tespit et, yakala ve koleksiyonuna ekle!
          </Text>
        </Card>
      </View>

      {/* Bottom info */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <View className="bg-coin rounded-full px-3 py-1">
            <Text className="font-body text-xs text-text-primary">
              🪙 {player.coins}
            </Text>
          </View>
          <View className="bg-success rounded-full px-3 py-1">
            <Text className="font-body text-xs text-text-primary">
              ⚡ Lv.{player.level}
            </Text>
          </View>
        </View>
        <Text className="font-body text-xs text-text-muted">
          {player.catches} yakalama
        </Text>
      </View>
    </SafeAreaView>
  );
}
