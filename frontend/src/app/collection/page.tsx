"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "../../components/GlassCard";

type CaughtPet = {
  id: number;
  funnyName: string;
  species: string;
  breed: string;
  confidence: number;
  photo: string;
  timestamp: string;
};

export default function CollectionPage() {
  const [pets, setPets] = useState<CaughtPet[]>([]);

  useEffect(() => {
    // Demo: Load from localStorage (will be replaced by on-chain data later)
    const saved = localStorage.getItem("catchcat_pets");
    if (saved) {
      setPets(JSON.parse(saved));
    }
  }, []);

  // For demo, allow clearing
  const clearCollection = () => {
    localStorage.removeItem("catchcat_pets");
    setPets([]);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">Koleksiyonum</h1>
          <p className="text-gray-400">Yakaladığın kediler ve köpekler</p>
        </div>
        {pets.length > 0 && (
          <button onClick={clearCollection} className="text-xs text-red-400 hover:underline">
            Koleksiyonu temizle (demo)
          </button>
        )}
      </div>

      {pets.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <div className="text-6xl mb-4">🐾</div>
          <p className="text-xl text-gray-400">Henüz hiçbir şey yakalamadın.</p>
          <p className="text-sm mt-2 text-gray-500">/catch sayfasına git ve ilk yakalamanı yap.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map((pet) => (
            <GlassCard key={pet.id} className="overflow-hidden">
              <img src={pet.photo} alt={pet.funnyName} className="w-full aspect-video object-cover" />
              <div className="p-4">
                <div className="font-bold text-lg">{pet.funnyName}</div>
                <div className="text-sm text-gray-400">
                  {pet.species === "cat" ? "🐱" : "🐶"} {pet.breed}
                </div>
                <div className="mt-2 text-xs text-emerald-400">
                  Güven: {(pet.confidence * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] text-gray-500 mt-3">
                  {new Date(pet.timestamp).toLocaleString("tr-TR")}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
