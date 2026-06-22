import type { Animal } from "./store";

/**
 * COCO-SSD modelinin tanıyabildiği hayvan sınıfları
 * sadece bunlar kabul edilir, diğer tespitler reddedilir
 */
export const ANIMAL_SPECIES = [
  "cat",
  "dog",
  "bird",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
] as const;

export type AnimalSpecies = (typeof ANIMAL_SPECIES)[number];

interface SpeciesConfig {
  label: string;
  emoji: string;
  breeds: string[];
  statRange: { hp: [number, number]; atk: [number, number]; def: [number, number]; spd: [number, number] };
}

const SPECIES_DATA: Record<AnimalSpecies, SpeciesConfig> = {
  cat: {
    label: "Kedi",
    emoji: "🐱",
    breeds: ["Tekir", "Van Kedisi", "British Shorthair", "Maine Coon", "Siyam"],
    statRange: { hp: [30, 50], atk: [40, 60], def: [20, 40], spd: [60, 80] },
  },
  dog: {
    label: "Köpek",
    emoji: "🐶",
    breeds: ["Golden", "Labrador", "Kangal", "Beagle", "Poodle"],
    statRange: { hp: [50, 80], atk: [50, 70], def: [40, 60], spd: [40, 60] },
  },
  bird: {
    label: "Kuş",
    emoji: "🐦",
    breeds: ["Muhabbet", "Kanarya", "Papağan", "Kartal", "Baykuş"],
    statRange: { hp: [20, 35], atk: [25, 45], def: [15, 30], spd: [70, 90] },
  },
  horse: {
    label: "At",
    emoji: "🐴",
    breeds: ["Arap Atı", "Midilli", "Friesian", "Mustang", "Tay"],
    statRange: { hp: [60, 90], atk: [40, 60], def: [35, 55], spd: [60, 80] },
  },
  sheep: {
    label: "Koyun",
    emoji: "🐑",
    breeds: ["Merinos", "Karaman", "Kıvırcık", "Dağlıç", "Sakız"],
    statRange: { hp: [40, 60], atk: [20, 35], def: [50, 70], spd: [25, 40] },
  },
  cow: {
    label: "İnek",
    emoji: "🐄",
    breeds: ["Holstein", "Jersey", "Montofon", "Boz Irk", "Simmental"],
    statRange: { hp: [70, 100], atk: [30, 50], def: [60, 80], spd: [20, 35] },
  },
  elephant: {
    label: "Fil",
    emoji: "🐘",
    breeds: ["Afrika Fili", "Asya Fili", "Orman Fili", "Çalı Fili", "Cüce Fil"],
    statRange: { hp: [100, 150], atk: [70, 90], def: [80, 100], spd: [15, 30] },
  },
  bear: {
    label: "Ayı",
    emoji: "🐻",
    breeds: ["Boz Ayı", "Kutup Ayısı", "Panda", "Tembel Ayı", "Siyah Ayı"],
    statRange: { hp: [80, 120], atk: [75, 95], def: [60, 85], spd: [25, 40] },
  },
  zebra: {
    label: "Zebra",
    emoji: "🦓",
    breeds: ["Ova Zebrası", "Dağ Zebrası", "Grevy Zebrası", "Çizgili", "Kır"],
    statRange: { hp: [50, 75], atk: [35, 55], def: [40, 60], spd: [55, 75] },
  },
  giraffe: {
    label: "Zürafa",
    emoji: "🦒",
    breeds: ["Masai", "Reticulated", "Güney Afrika", "Angola", "Nübye"],
    statRange: { hp: [60, 90], atk: [30, 50], def: [35, 55], spd: [40, 60] },
  },
};

const NAME_PREFIXES = [
  "Sir", "Lord", "Captain", "Professor", "King", "Baron", "Duke",
  "Sergeant", "Commander", "Chief", "General", "Admiral", "Bebek", "Prenses",
];

const NAME_SUFFIXES = [
  "Whiskers", "Paws", "Biscuit", "Snuggles", "Pepper", "Bubbles", "Pickle",
  "Taco", "Waffle", "Mochi", "Noodle", "Dumpling", "Sprout", "Mango",
];

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInRange([min, max]: [number, number]): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRarity(): 1 | 2 | 3 | 4 | 5 {
  const roll = Math.random();
  if (roll < 0.40) return 1;    // Common %40
  if (roll < 0.70) return 2;    // Uncommon %30
  if (roll < 0.88) return 3;    // Rare %18
  if (roll < 0.97) return 4;    // Epic %9
  return 5;                     // Legendary %3
}

const RARITY_MULTIPLIER = [1, 1.2, 1.5, 2.0, 3.0];

export function generateAnimal(species: AnimalSpecies, photoUri: string): Animal {
  const config = SPECIES_DATA[species];
  const rarity = generateRarity();
  const mult = RARITY_MULTIPLIER[rarity - 1];

  const prefix = randomFrom(NAME_PREFIXES);
  const suffix = randomFrom(NAME_SUFFIXES);

  const clampStat = (range: [number, number]): number => {
    const val = randomInRange(range);
    return Math.min(Math.round(val * mult), 999);
  };

  return {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    species,
    breedVariant: randomFrom(config.breeds),
    funnyName: `${prefix} ${suffix}`,
    photoUri,
    stats: {
      hp: clampStat(config.statRange.hp),
      atk: clampStat(config.statRange.atk),
      def: clampStat(config.statRange.def),
      spd: clampStat(config.statRange.spd),
      rarity,
    },
    xp: 10 + rarity * 5,
    level: 1,
    caughtAt: new Date().toISOString(),
  };
}

export function getSpeciesLabel(species: string): string {
  return SPECIES_DATA[species as AnimalSpecies]?.label ?? species;
}

export function getSpeciesEmoji(species: string): string {
  return SPECIES_DATA[species as AnimalSpecies]?.emoji ?? "🐾";
}
