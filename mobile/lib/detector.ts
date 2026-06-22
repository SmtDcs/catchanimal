import { ANIMAL_SPECIES, type AnimalSpecies } from "./animals";

export interface DetectionResult {
  species: AnimalSpecies;
  confidence: number;
}

/**
 * Simüle edilmiş hayvan tespiti.
 *
 * GERÇEK ML İÇİN:
 * Bu fonksiyon ileride @tensorflow/tfjs + @tensorflow-models/coco-ssd
 * ile değiştirilecek. Camera'dan alınan frame resize edilip
 * COCO-SSD modeline verilecek, çıktıdaki animal class'lar filtrelenecek.
 *
 * Not: React Native'de TF.js çalıştırmak için @tensorflow/tfjs-react-native
 * ve expo-gl gerekiyor. Bu MVP'de simüle çalışıyoruz.
 */
export async function detectAnimal(_imageUri: string): Promise<DetectionResult | null> {
  // TODO: Replace with real TF.js / MLKit inference
  // Simulate ML latency
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

  // %70 ihtimalle hayvan bulundu (test için yüksek)
  if (Math.random() < 0.7) {
    const species = ANIMAL_SPECIES[Math.floor(Math.random() * ANIMAL_SPECIES.length)];
    return {
      species,
      confidence: 0.65 + Math.random() * 0.3,
    };
  }

  return null;
}
