import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getSpeciesEmoji, getSpeciesLabel, type AnimalSpecies } from "../../lib/animals";

interface GameProps {
  species: AnimalSpecies;
  onSuccess: () => void;
  onFail: () => void;
  difficulty: 1 | 2 | 3;
}

interface Target {
  id: number;
  x: number;
  y: number;
}

const LEVELS: Record<number, { hit: number; total: number; duration: number }> = {
  1: { hit: 5, total: 7, duration: 1500 },
  2: { hit: 6, total: 9, duration: 1200 },
  3: { hit: 7, total: 11, duration: 900 },
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const PADDING = 60;
const TARGET_SIZE = 64;

export function AimTargetGame({ species, onSuccess, onFail, difficulty }: GameProps) {
  const [phase, setPhase] = useState<"playing" | "success" | "fail">("playing");
  const [target, setTarget] = useState<Target | null>(null);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [round, setRound] = useState(0);
  const level = LEVELS[difficulty];
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const spawnTarget = useCallback(() => {
    const x = PADDING + Math.random() * (SCREEN_W - PADDING * 2 - TARGET_SIZE);
    const y = PADDING + Math.random() * (SCREEN_H - PADDING * 2 - TARGET_SIZE);
    setTarget({ id: Date.now(), x, y });
  }, []);

  // Start spawning
  useEffect(() => {
    if (phase !== "playing") return;
    spawnTarget();
  }, [phase, spawnTarget]);

  // Auto-miss if timer runs out
  useEffect(() => {
    if (!target || phase !== "playing") return;

    timerRef.current = setTimeout(() => {
      setTarget(null);
      const newMissed = missed + 1;
      setMissed(newMissed);
      const newRound = round + 1;
      setRound(newRound);

      if (newMissed > level.total - level.hit || newRound >= level.total) {
        setPhase("fail");
        setTimeout(onFail, 1200);
      } else {
        spawnTarget();
      }
    }, level.duration);

    return () => clearTimeout(timerRef.current);
  }, [target, phase, missed, round, level, spawnTarget, onFail]);

  const handleTargetTap = useCallback(() => {
    if (phase !== "playing" || !target) return;
    clearTimeout(timerRef.current);

    const newScore = score + 1;
    setScore(newScore);
    setTarget(null);
    const newRound = round + 1;
    setRound(newRound);

    if (newScore >= level.hit) {
      setPhase("success");
      setTimeout(onSuccess, 1200);
    } else {
      spawnTarget();
    }
  }, [phase, target, score, round, level, spawnTarget, onSuccess]);

  const remaining = level.hit - score;
  const lives = level.total - level.hit - missed;

  return (
    <View className="flex-1 bg-cream">
      {/* HUD */}
      <View className="flex-row justify-between items-center px-4 pt-8 pb-2">
        <Text className="font-body text-sm text-text-primary">🎯 {remaining} kaldı</Text>
        <Text className="font-display text-sm">
          {getSpeciesEmoji(species)} {getSpeciesLabel(species)}
        </Text>
        <Text className="font-body text-sm text-text-primary">❤️ {Math.max(lives, 0)}</Text>
      </View>

      {phase === "playing" && (
        <>
          {/* Instruction */}
          {!target && (
            <View className="flex-1 items-center justify-center">
              <Text className="font-body text-text-secondary">Hedef bekleniyor...</Text>
            </View>
          )}

          {/* Target */}
          {target && (
            <TouchableOpacity
              key={target.id}
              onPress={handleTargetTap}
              activeOpacity={0.6}
              className="absolute items-center justify-center"
              style={{
                left: target.x,
                top: target.y,
                width: TARGET_SIZE,
                height: TARGET_SIZE,
              }}
            >
              <View className="w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg">
                <Text className="text-2xl">🎯</Text>
              </View>
            </TouchableOpacity>
          )}
        </>
      )}

      {phase === "success" && (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
          <Text className="font-display text-xl text-success mt-3">Yakalandı! 🎉</Text>
          <Text className="font-body text-sm text-text-secondary mt-1">{score}/{level.hit} isabet</Text>
        </View>
      )}

      {phase === "fail" && (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="close-circle" size={64} color="#E53935" />
          <Text className="font-display text-xl text-error mt-3">Kaçtı! 😢</Text>
          <Text className="font-body text-sm text-text-secondary mt-1">{score}/{level.hit} isabet</Text>
        </View>
      )}
    </View>
  );
}
