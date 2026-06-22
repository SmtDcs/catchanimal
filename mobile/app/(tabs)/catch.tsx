import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../lib/store";

export default function CatchScreen() {
  const player = useStore((s) => s.player);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="font-display text-3xl text-text-primary">CatchCat</Text>
        <Text className="font-body text-sm text-text-secondary">
          Kameranı aç, hayvanları yakala!
        </Text>
      </View>

      {/* Camera placeholder */}
      <View className="flex-1 mx-4 bg-wood-light rounded-3xl items-center justify-center border-2 border-wood/30">
        <Ionicons name="camera-outline" size={64} color="#C4956A" />
        <Text className="font-body text-text-secondary mt-3">
          Kamerayı açmak için dokun
        </Text>
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
