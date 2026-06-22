"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "../../components/GlassCard";
import { AnimatedButton } from "../../components/AnimatedButton";
import { MapPin, Target } from "lucide-react";

type WildPet = {
  id: number;
  species: "cat" | "dog";
  breed: string;
  funnyName: string;
  distance: number;
  rarity: number; // 0-4
};

function generateWildPets(): WildPet[] {
  const cats = ["Tabby", "Siamese", "Maine Coon", "Persian"];
  const dogs = ["Labrador", "Beagle", "Poodle", "Bulldog"];

  const namesCat = ["Whiskerstein", "Meowtholomew", "Pawdrick"];
  const namesDog = ["Barktholomew", "Ruffington", "Drooliver"];

  const pets: WildPet[] = [];

  for (let i = 0; i < 5; i++) {
    const isCat = Math.random() > 0.45;
    const breedList = isCat ? cats : dogs;
    const nameList = isCat ? namesCat : namesDog;

    pets.push({
      id: Date.now() + i,
      species: isCat ? "cat" : "dog",
      breed: breedList[Math.floor(Math.random() * breedList.length)],
      funnyName: `${["Sir", "Lord", "Captain"][Math.floor(Math.random() * 3)]} ${nameList[Math.floor(Math.random() * nameList.length)]}`,
      distance: Math.floor(Math.random() * 850) + 80,
      rarity: Math.floor(Math.random() * 5),
    });
  }

  return pets.sort((a, b) => a.distance - b.distance);
}

const rarityLabels = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
const rarityColors = ["text-gray-400", "text-green-400", "text-blue-400", "text-purple-400", "text-orange-400"];

export default function DiscoverPage() {
  const [wildPets, setWildPets] = useState<WildPet[]>([]);
  const [userLocation, setUserLocation] = useState<string>("Konum alınamadı");
  const [catchingId, setCatchingId] = useState<number | null>(null);

  useEffect(() => {
    // Generate wild pets
    setWildPets(generateWildPets());

    // Try to get real location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation(
            `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
          );
        },
        () => {
          setUserLocation("Ankara, Türkiye (simüle)");
        }
      );
    } else {
      setUserLocation("Ankara, Türkiye (simüle)");
    }
  }, []);

  const catchWildPet = (pet: WildPet) => {
    setCatchingId(pet.id);

    // Simulate finding + capture
    setTimeout(() => {
      const photo = `https://picsum.photos/seed/${pet.id}/400/300`; // placeholder photo for wild

      const newCatch = {
        id: Date.now(),
        funnyName: pet.funnyName,
        species: pet.species,
        breed: pet.breed,
        confidence: 0.78 + Math.random() * 0.18,
        photo,
        timestamp: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem("catchcat_pets") || "[]");
      localStorage.setItem("catchcat_pets", JSON.stringify([newCatch, ...existing]));

      alert(
        `🌲 Vahşi ${pet.species === "cat" ? "kedi" : "köpek"} yakalandı!\n\n` +
        `${pet.funnyName} (${pet.breed})\n` +
        `${pet.distance}m uzakta bulundu.\n\n` +
        "Koleksiyona eklendi!"
      );

      // Remove from wild list
      setWildPets((prev) => prev.filter((p) => p.id !== pet.id));
      setCatchingId(null);
    }, 850);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <MapPin className="w-9 h-9 text-emerald-500" />
          Keşfet
        </h1>
        <p className="text-gray-400 mt-1">
          Konumuna yakın vahşi pet'ler • {userLocation}
        </p>
      </div>

      <GlassCard className="p-6 mb-4">
        <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" /> Yakınındaki vahşi spawn'lar
        </div>

        {wildPets.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Bu bölgede başka vahşi pet kalmadı. Yenilemek için sayfayı yenile.
          </div>
        ) : (
          <div className="space-y-3">
            {wildPets.map((pet) => (
              <div
                key={pet.id}
                className="flex items-center justify-between gap-4 bg-white/5 rounded-2xl p-4 border border-white/10"
              >
                <div>
                  <div className="font-semibold text-lg">
                    {pet.species === "cat" ? "🐱" : "🐶"} {pet.funnyName}
                  </div>
                  <div className="text-sm text-gray-400">
                    {pet.breed} • {pet.distance}m uzakta
                  </div>
                  <div className={`text-xs mt-1 ${rarityColors[pet.rarity]}`}>
                    {rarityLabels[pet.rarity]}
                  </div>
                </div>

                <AnimatedButton
                  onClick={() => catchWildPet(pet)}
                  disabled={catchingId === pet.id}
                  className="text-sm px-5 py-2"
                >
                  {catchingId === pet.id ? "Yakalanılıyor..." : "Yakala"}
                </AnimatedButton>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      <div className="text-center text-xs text-gray-500">
        Not: Vahşi pet'ler herkese açık. Kimse başkasının yakaladığı kediyi/köpeği alamaz.
      </div>
    </div>
  );
}
