import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { getSpeciesEmoji, getSpeciesLabel, type AnimalSpecies } from "../lib/animals";
import { BalanceGame } from "./games/BalanceGame";
import { QuickTapGame } from "./games/QuickTapGame";
import { AimTargetGame } from "./games/AimTargetGame";

interface CatchGameProps {
  species: AnimalSpecies;
  onSuccess: () => void;
  onFail: () => void;
  difficulty: 1 | 2 | 3;
}

type GameType = "balance" | "quicktap" | "aim";

const GAMES: GameType[] = ["balance", "quicktap", "aim"];

const GAME_NAMES: Record<GameType, { name: string; desc: string }> = {
  balance: { name: "Denge", desc: "Doğru anda dokun!" },
  quicktap: { name: "Hızlı Tıkla", desc: "Patiye hızlı hızlı vur!" },
  aim: { name: "Hedef Vur", desc: "Hedefleri vur!" },
};

export function CatchGame(props: CatchGameProps) {
  const [game, setGame] = useState<GameType | null>(null);

  useEffect(() => {
    const idx = Math.floor(Math.random() * GAMES.length);
    setGame(GAMES[idx]);
  }, []);

  if (!game) {
    return (
      <View className="flex-1 bg-cream items-center justify-center">
        <Text className="text-6xl mb-3">{getSpeciesEmoji(props.species)}</Text>
        <Text className="font-display text-lg text-text-primary">{getSpeciesLabel(props.species)}</Text>
        <Text className="font-body text-sm text-text-secondary mt-2">Oyun seçiliyor...</Text>
      </View>
    );
  }

  switch (game) {
    case "balance":
      return <BalanceGame {...props} />;
    case "quicktap":
      return <QuickTapGame {...props} />;
    case "aim":
      return <AimTargetGame {...props} />;
  }
}
