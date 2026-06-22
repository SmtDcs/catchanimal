"use client";

import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { injected } from "wagmi/connectors";
import { useState } from "react";
import toast from "react-hot-toast";
import { GlassCard } from "../components/GlassCard";
import { AnimatedButton } from "../components/AnimatedButton";
import { Camera, Wallet } from "lucide-react";

export default function CatchCatHome() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const [isMinting, setIsMinting] = useState(false);

  // Placeholder contract - will be replaced in later phases with real deployed address
  const PLACEHOLDER_CONTRACT = "0x0000000000000000000000000000000000000000";

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const handleTestMint = async () => {
    if (!isConnected || !address) {
      toast.error("Önce cüzdanını bağla");
      return;
    }

    setIsMinting(true);
    toast.loading("Test mint başlıyor (Aşama 1)...");

    try {
      // Dummy call - gerçek contract deploy edilince güncellenecek
      // For now we simulate success for Aşama 1
      await new Promise(resolve => setTimeout(resolve, 1200));

      toast.dismiss();
      toast.success("Test NFT basıldı! (Gerçek mint Aşama 4'te gelecek)");
      
      // In real version we would do:
      // writeContract({
      //   address: PLACEHOLDER_CONTRACT,
      //   abi: [...],
      //   functionName: "mintPet",
      //   args: ["cat", "Tabby", 2, "Sir Meowington", "ipfs://dummy"]
      // });
    } catch (e) {
      toast.dismiss();
      toast.error("Bir hata oluştu");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-3xl">
            🐱🐶
          </div>
          <h1 className="text-6xl font-bold tracking-tighter">CatchCat</h1>
        </div>
        <p className="text-xl text-gray-400 max-w-md mx-auto">
          Kameranı aç. Kediyi veya köpeği tespit et.<br />
          Yakala. NFT olarak sahiplen.
        </p>
        <p className="mt-3 text-sm text-emerald-400">Canlı kamera + Gerçek AI (COCO-SSD) • Sürükle &amp; bırak minigame</p>
      </div>

      <GlassCard className="p-8 mb-8">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
            <Camera className="w-10 h-10 text-emerald-400" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Aşama 1 Tamamlandı mı?</h2>
            <p className="text-gray-400 max-w-sm">
              Cüzdan bağlantısı + temel test mint çalışıyor. 
              Gerçek AI + kamera + minigame bir sonraki aşamalarda gelecek.
            </p>
          </div>

          {!isConnected ? (
            <AnimatedButton 
              onClick={handleConnect} 
              className="flex items-center gap-2 px-8 py-4 text-lg"
            >
              <Wallet className="w-5 h-5" />
              Cüzdanı Bağla (Monad Testnet)
            </AnimatedButton>
          ) : (
            <div className="space-y-4 w-full max-w-xs">
              <div className="text-sm bg-white/5 rounded px-4 py-2 font-mono break-all">
                {address}
              </div>

              <AnimatedButton
                onClick={handleTestMint}
                disabled={isMinting || isPending || isConfirming}
                className="w-full flex items-center justify-center gap-2 py-4"
              >
                {isMinting || isPending || isConfirming ? "İşleniyor..." : "Test NFT Bas (Aşama 1)"}
              </AnimatedButton>

              {isSuccess && (
                <p className="text-emerald-400 text-sm">Başarılı! (Gerçek mint daha sonra)</p>
              )}
            </div>
          )}
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <GlassCard className="p-5">
          <div className="font-semibold mb-1">1. Kamera + AI</div>
          <div className="text-gray-400">Aşama 2'de geliyor</div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="font-semibold mb-1">2. Minigame ile Yakala</div>
          <div className="text-gray-400">Mama fırlat veya okşa</div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="font-semibold mb-1">3. Fotoğraflı NFT Kart</div>
          <div className="text-gray-400">Komik isim + rarity</div>
        </GlassCard>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        Monad Testnet • Henüz sadece test. Gerçek AI ve harita Aşama 2+ ile gelecek.
      </div>
    </div>
  );
}
