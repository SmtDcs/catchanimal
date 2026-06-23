import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getSpeciesEmoji, getSpeciesLabel, type AnimalSpecies } from "../../lib/animals";

interface GameProps {
  species: AnimalSpecies;
  onSuccess: () => void;
  onFail: () => void;
  difficulty: 1 | 2 | 3;
}

export function BalanceGame({ species, onSuccess, onFail, difficulty }: GameProps) {
  const position = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState<"playing" | "success" | "fail">("playing");
  const zoneRef = useRef({ start: 0, end: 0 });
  const [attempt, setAttempt] = useState(1);
  const maxAttempts = 3;
  const speed = 800 + (3 - difficulty) * 400;
  const zoneWidth = 0.25 - (difficulty - 1) * 0.05;
  const zoneStart = useRef(Math.random() * (1 - zoneWidth));
  const zoneEnd = useRef(zoneStart.current + zoneWidth);

  useEffect(() => { zoneRef.current = { start: zoneStart.current, end: zoneEnd.current }; }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(position, { toValue: 1, duration: speed, useNativeDriver: true }),
        Animated.timing(position, { toValue: 0, duration: speed, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [phase, speed, position]);

  const handleTap = useCallback(() => {
    if (phase !== "playing") return;
    position.stopAnimation((value) => {
      if (value >= zoneRef.current.start && value <= zoneRef.current.end) {
        setPhase("success");
        setTimeout(onSuccess, 1500);
      } else if (attempt < maxAttempts) {
        setAttempt((a) => a + 1);
      } else {
        setPhase("fail");
        setTimeout(onFail, 1500);
      }
    });
  }, [phase, attempt, onSuccess, onFail, position]);

  return (
    <View className="flex-1 bg-cream items-center justify-center px-6">
      <Text className="text-6xl mb-2">{getSpeciesEmoji(species)}</Text>
      <Text className="font-display text-xl text-text-primary mb-1">{getSpeciesLabel(species)}</Text>
      <Text className="font-body text-sm text-text-secondary mb-4">Doğru anda dokun!</Text>

      {phase === "playing" && (
        <View className="w-full max-w-sm">
          <View className="flex-row justify-between mb-2">
            <Text className="font-body text-xs text-text-muted">Deneme: {attempt}/{maxAttempts}</Text>
            <Text className="font-body text-xs text-text-muted">Denge</Text>
          </View>
          <TouchableOpacity onPress={handleTap} activeOpacity={1}>
            <View className="w-full h-16 bg-wood-dark rounded-2xl overflow-hidden relative">
              <View className="absolute h-full bg-success/40 rounded-2xl"
                style={{ left: `${zoneStart.current * 100}%`, width: `${zoneWidth * 100}%` }} />
              <Animated.View className="w-1 h-full bg-primary absolute"
                style={[{ transform: [{ translateX: position.interpolate({ inputRange: [0, 1], outputRange: [0, 300] }) }] }]} />
            </View>
          </TouchableOpacity>
          <Text className="font-body text-xs text-text-muted text-center mt-3">Yeşil bölgedeyken dokun!</Text>
        </View>
      )}

      {phase === "success" && (
        <View className="items-center">
          <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
          <Text className="font-display text-xl text-success mt-3">Yakalandı! 🎉</Text>
        </View>
      )}

      {phase === "fail" && (
        <View className="items-center">
          <Ionicons name="close-circle" size={64} color="#E53935" />
          <Text className="font-display text-xl text-error mt-3">Kaçtı! 😢</Text>
          <Text className="font-body text-sm text-text-secondary mt-1">Bir dahaki sefere!</Text>
        </View>
      )}
    </View>
  );
}
