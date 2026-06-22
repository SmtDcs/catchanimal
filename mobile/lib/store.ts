import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Animal {
  id: string;
  species: string;
  breedVariant: string;
  funnyName: string;
  photoUri: string;
  stats: {
    hp: number;
    atk: number;
    def: number;
    spd: number;
    rarity: 1 | 2 | 3 | 4 | 5;
  };
  xp: number;
  level: number;
  caughtAt: string;
  location?: { lat: number; lng: number };
}

export interface Player {
  xp: number;
  level: number;
  coins: number;
  catches: number;
}

interface AppState {
  player: Player;
  collection: Animal[];
  addAnimal: (animal: Animal) => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
}

const XP_PER_LEVEL = 100;

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      player: { xp: 0, level: 1, coins: 0, catches: 0 },
      collection: [],

      addAnimal: (animal) =>
        set((state) => {
          const newXp = state.player.xp + 25;
          const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
          return {
            collection: [animal, ...state.collection],
            player: {
              ...state.player,
              xp: newXp,
              level: newLevel,
              catches: state.player.catches + 1,
              coins:
                state.player.coins + (newLevel > state.player.level ? 50 : 10),
            },
          };
        }),

      addXp: (amount) =>
        set((state) => {
          const newXp = state.player.xp + amount;
          const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
          return {
            player: {
              ...state.player,
              xp: newXp,
              level: newLevel,
              coins:
                state.player.coins + (newLevel > state.player.level ? 50 : 0),
            },
          };
        }),

      addCoins: (amount) =>
        set((state) => ({
          player: { ...state.player, coins: state.player.coins + amount },
        })),
    }),
    {
      name: "catchcat-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
