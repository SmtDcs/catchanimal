import { View, Text, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useStore } from "../../lib/store";

const RARITY_LABELS = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

export default function CollectionScreen() {
  const collection = useStore((s) => s.collection);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-6 pt-4 pb-2">
        <Text className="font-display text-3xl text-text-primary">
          Koleksiyon
        </Text>
        <Text className="font-body text-sm text-text-secondary">
          {collection.length} hayvan
        </Text>
      </View>

      {collection.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="albums-outline" size={64} color="#D4B896" />
          <Text className="font-body text-text-secondary mt-4 text-center">
            Henüz hiçbir şey yakalamadın.
            {"\n"}
            Yakala sekmesine git ve ilkini bul!
          </Text>
        </View>
      ) : (
        <FlatList
          data={collection}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, gap: 16 }}
          columnWrapperStyle={{ gap: 16 }}
          renderItem={({ item }) => (
            <Card className="flex-1">
              {item.photoUri ? (
                <Image
                  source={{ uri: item.photoUri }}
                  className="w-full aspect-square rounded-xl"
                />
              ) : (
                <View className="w-full aspect-square bg-wood-light rounded-xl items-center justify-center">
                  <Ionicons name="paw" size={32} color="#C4956A" />
                </View>
              )}
              <Text className="font-display text-sm text-text-primary mt-2">
                {item.funnyName}
              </Text>
              <Badge
                label={RARITY_LABELS[item.stats.rarity - 1]}
                variant="rarity"
                className="mt-1"
              />
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
