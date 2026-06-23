import { View, Text, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getSpeciesEmoji, getSpeciesLabel, type AnimalSpecies } from "../../lib/animals";

interface GameProps {
  species: AnimalSpecies;
  onSuccess: () => void;
  onFail: () => void;
  difficulty: 1 | 2 | 3;
}

const TARGETS: Record<number, { taps: number; time: number }> = {
  1: { taps: 10, time: 6000 },
  2: { taps: 15, time: 5000 },
  3: { taps: 20, time: 5000 },
};

export function QuickTapGame({ species, onSuccess, onFail, difficulty }: GameProps) {
  const [phase, setPhase] = useState<"playing" | "success" | "fail">("playing");
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TARGETS[difficulty].time / 1000);
  const target = TARGETS[difficulty].taps;
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Time's up check
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      setPhase("fail");
      setTimeout(onFail, 1200);
    }
  }, [timeLeft, phase, onFail]);

  // Success check
  useEffect(() => {
    if (phase !== "playing") return;
    if (count >= target) {
      setPhase("success");
      clearInterval(timerRef.current);
      setTimeout(onSuccess, 1200);
    }
  }, [count, target, phase, onSuccess]);

  const handleTap = useCallback(() => {
    if (phase !== "playing") return;
    setCount((c) => c + 1);
  }, [phase]);

  const progress = Math.min(count / target, 1);

  return (
    <View className="flex-1 bg-cream items-center justify-center px-6">
      <Text className="text-6xl mb-2">{getSpeciesEmoji(species)}</Text>
      <Text className="font-display text-xl text-text-primary mb-1">{getSpeciesLabel(species)}</Text>
      <Text className="font-body text-sm text-text-secondary mb-6">Hızlı tıkla yakala!</Text>

      {phase === "playing" && (
        <View className="w-full max-w-sm items-center">
          {/* Timer & Counter */}
          <View className="flex-row justify-between w-full mb-4">
            <Text className="font-body text-lg text-text-primary">
              ⏱ {timeLeft}s
            </Text>
            <Text className="font-body text-lg text-text-primary">
              {count}/{target}
            </Text>
          </View>

          {/* Progress bar */}
          <View className="w-full h-4 bg-wood-dark rounded-full overflow-hidden mb-8">
            <View className="h-full bg-success rounded-full" style={{ width: `${progress * 100}%` }} />
          </View>

          {/* Big tap button */}
          <TouchableOpacity
            onPress={handleTap}
            activeOpacity={0.7}
            className="w-48 h-48 bg-primary rounded-full items-center justify-center shadow-lg active:scale-95"
          >
            <Text className="text-6xl">🐾</Text>
          </TouchableOpacity>

          <Text className="font-body text-xs text-text-muted text-center mt-4">
            Patiye hızlı hızlı dokun!
          </Text>
        </View>
      )}

      {phase === "success" && (
        <View className="items-center">
          <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
          <Text className="font-display text-xl text-success mt-3">Yakalandı! 🎉</Text>
          <Text className="font-body text-sm text-text-secondary mt-1">{count} tık!</Text>
        </View>
      )}

      {phase === "fail" && (
        <View className="items-center">
          <Ionicons name="close-circle" size={64} color="#E53935" />
          <Text className="font-display text-xl text-error mt-3">Kaçtı! 😢</Text>
          <Text className="font-body text-sm text-text-secondary mt-1">Sadece {count}/{target} tık</Text>
        </View>
      )}
    </View>
  );
}
