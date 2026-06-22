"use client";

import { useRef, useState } from "react";
import { GlassCard } from "../../components/GlassCard";
import { AnimatedButton } from "../../components/AnimatedButton";
import { Camera, X, Target } from "lucide-react";

// Lazy load TF.js to keep initial bundle smaller
let cocoModel: any = null;

async function loadModel() {
  if (cocoModel) return cocoModel;

  // Set WebGL backend for better performance (falls back to CPU if not available)
  const tf = await import("@tensorflow/tfjs");
  await tf.ready();
  try {
    await tf.setBackend("webgl");
  } catch {
    console.warn("WebGL backend not available, falling back to CPU");
  }

  const cocoSsd = await import("@tensorflow-models/coco-ssd");
  cocoModel = await cocoSsd.load();
  return cocoModel;
}

function generateFunnyName(species: string) {
  const catPrefixes = ["Sir", "Lord", "Captain", "Professor", "King", "Baron", "Duke"];
  const dogPrefixes = ["Sergeant", "Commander", "Chief", "General", "Admiral", "Marshal"];
  const catSuffixes = ["Whiskers", "Meowington", "Pawsworth", "Fuzzball", "Purrfecto", "Clawdius", "Mittens"];
  const dogSuffixes = ["Barkley", "Woofington", "Tailsworth", "Biscuit", "Ruffus", "Droolbert", "Sniffles"];

  const prefixes = species === "cat" ? catPrefixes : dogPrefixes;
  const suffixes = species === "cat" ? catSuffixes : dogSuffixes;

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  return `${prefix} ${suffix}`;
}

export default function CatchPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<{
    species: string;
    breed: string;
    confidence: number;
    funnyName: string;
  } | null>(null);
  const [showMinigame, setShowMinigame] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // Start live camera
  const startCamera = async () => {
    try {
      // Minimal constraints — geniş uyumluluk için
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;

      // Video elementi her zaman DOM'da (CSS ile gizleniyor),
      // bu yüzden ref her an geçerli
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Mobilde autoPlay her zaman çalışmaz, explicit play() gerekli
        await videoRef.current.play();
      }

      setIsCameraOn(true);
      setDetectionResult(null);
      setCapturedPhoto(null);
      setShowMinigame(false);
    } catch (err) {
      alert("Kamera erişimi alınamadı. Lütfen tarayıcı izinlerini kontrol et (https kullan).");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setShowMinigame(false);
    setDetectionResult(null);
    setCapturedPhoto(null);
  };

  // Capture current video frame as photo (for NFT later)
  const captureFrame = (): string => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return "";

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL("image/jpeg", 0.85);
  };

  // Real AI detection using COCO-SSD
  const runDetection = async () => {
    const video = videoRef.current;
    if (!video || !isCameraOn) return;

    setIsDetecting(true);
    setIsLoadingModel(true);

    try {
      const model = await loadModel();
      setIsLoadingModel(false);

      // Run detection on current video frame
      const predictions = await model.detect(video);

      // Look for cat or dog with reasonable confidence
      const petPrediction = predictions.find(
        (p: any) =>
          (p.class === "cat" || p.class === "dog") &&
          p.score > 0.6
      );

      if (petPrediction) {
        const species = petPrediction.class; // "cat" or "dog"
        const confidence = petPrediction.score;

        // Simple breed approximation (COCO doesn't give breed, we fake a nice one for now)
        const breedMap: Record<string, string[]> = {
          cat: ["Tabby", "Maine Coon", "Siamese", "Persian", "British Shorthair"],
          dog: ["Golden Retriever", "Labrador", "French Bulldog", "Beagle", "Poodle"],
        };
        const breedList = breedMap[species] || ["Mixed"];
        const breed = breedList[Math.floor(Math.random() * breedList.length)];

        const funnyName = generateFunnyName(species);

        const result = {
          species,
          breed,
          confidence,
          funnyName,
        };

        setDetectionResult(result);

        // Capture photo for this catch
        const photo = captureFrame();
        setCapturedPhoto(photo);

        setShowMinigame(true);
      } else {
        alert("Hiçbir kedi veya köpek tespit edilemedi. Daha iyi ışıkta ve net bir şekilde dene.");
      }
    } catch (err) {
      console.error("AI detection error:", err);
      alert("AI modeli yüklenirken bir sorun oluştu. Tarayıcını yenile veya farklı bir cihaz dene.");
    } finally {
      setIsDetecting(false);
      setIsLoadingModel(false);
    }
  };

  // Real interactive minigame (simple drag-to-throw)
  const [minigameState, setMinigameState] = useState({
    isDragging: false,
    x: 50,
    y: 70,
  });
  const [throwResult, setThrowResult] = useState<null | { success: boolean; message: string }>(null);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    setMinigameState(prev => ({ ...prev, isDragging: true }));
    updateDragPosition(e);
  };

  const updateDragPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const container = document.getElementById("minigame-area");
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const percentX = ((clientX - rect.left) / rect.width) * 100;
    const percentY = ((clientY - rect.top) / rect.height) * 100;

    setMinigameState(prev => ({
      ...prev,
      x: Math.max(10, Math.min(90, percentX)),
      y: Math.max(15, Math.min(85, percentY)),
    }));
  };

  const endDrag = () => {
    if (!detectionResult || !minigameState.isDragging) return;

    setMinigameState(prev => ({ ...prev, isDragging: false }));

    // Calculate throw success based on how close to center target
    const targetX = 50;
    const targetY = 45;
    const dx = minigameState.x - targetX;
    const dy = minigameState.y - targetY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const success = distance < 18; // sweet spot

    const message = success
      ? `Mükemmel atış! ${detectionResult.funnyName} yakalandı!`
      : "Iska! Biraz daha iyi nişan al.";

    setThrowResult({ success, message });

    if (success) {
      // Save to local collection (demo - later will be on-chain)
      const newPet = {
        id: Date.now(),
        funnyName: detectionResult.funnyName,
        species: detectionResult.species,
        breed: detectionResult.breed,
        confidence: detectionResult.confidence,
        photo: capturedPhoto || "",
        timestamp: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem("catchcat_pets") || "[]");
      localStorage.setItem("catchcat_pets", JSON.stringify([newPet, ...existing]));

      setTimeout(() => {
        alert(
          `🎉 Tebrikler!\n\n` +
          `${detectionResult.funnyName} (${detectionResult.breed})\n` +
          `Tür: ${detectionResult.species}\n` +
          `Güven: ${(detectionResult.confidence * 100).toFixed(0)}%\n\n` +
          "Koleksiyona eklendi! (Collection sayfasında gör)"
        );
        resetAfterCatch();
      }, 350);
    }
  };

  const resetAfterCatch = () => {
    setShowMinigame(false);
    setDetectionResult(null);
    setCapturedPhoto(null);
    setThrowResult(null);
    setMinigameState({ isDragging: false, x: 50, y: 70 });
  };

  const resetMinigame = () => {
    setThrowResult(null);
    setMinigameState({ isDragging: false, x: 50, y: 70 });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Camera className="w-9 h-9 text-emerald-500" />
          Yakala
        </h1>
        <p className="text-gray-400 mt-1">
          Kameranı aç → Gerçek AI ile canlı tespit et → Mini oyunla yakala
        </p>
      </div>

      <GlassCard className="p-6">
        {/* Camera Area */}
        <div className="relative bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center mb-6 border border-white/10">
          {/* Video her zaman DOM'da, kapalıyken gizle — ref her an geçerli olsun diye */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover ${!isCameraOn ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          />
          <canvas ref={canvasRef} className="hidden" />

          {!isCameraOn && (
            <div className="text-center text-gray-400 z-10">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Kamera kapalı</p>
              <p className="text-xs mt-1">Gerçek zamanlı AI tespiti için kamerayı aç</p>
            </div>
          )}

          {/* Detection overlay */}
          {detectionResult && (
            <div className="absolute bottom-4 left-4 bg-black/80 px-4 py-2 rounded-xl text-sm backdrop-blur">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <Target className="w-4 h-4" />
                <span>
                  {detectionResult.species === "cat" ? "🐱" : "🐶"} {detectionResult.breed}
                </span>
                <span className="text-xs text-white/70">
                  {(detectionResult.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="text-white font-semibold mt-0.5">{detectionResult.funnyName}</div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center">
          {!isCameraOn ? (
            <AnimatedButton onClick={startCamera} className="flex items-center gap-2 px-8">
              <Camera className="w-5 h-5" />
              Kamerayı Aç
            </AnimatedButton>
          ) : (
            <>
              <AnimatedButton
                onClick={stopCamera}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Kamerayı Kapat
              </AnimatedButton>

              {!showMinigame && (
                <AnimatedButton
                  onClick={runDetection}
                  disabled={isDetecting || isLoadingModel}
                  className="flex items-center gap-2"
                >
                  {isLoadingModel ? "AI Modeli Yükleniyor... (birkaç sn)" : isDetecting ? "AI Tespit Ediyor..." : "AI ile Tespit Et"}
                </AnimatedButton>
              )}

              {showMinigame && detectionResult && !throwResult && (
                <div className="text-center text-sm text-emerald-400">
                  Sürükle ve bırak ile mama fırlat!
                </div>
              )}
            </>
          )}
        </div>

        {/* Interactive Minigame Area */}
        {showMinigame && detectionResult && (
          <div className="mt-6">
            <div
              id="minigame-area"
              className="relative mx-auto w-full max-w-md aspect-[16/10] bg-zinc-950 rounded-2xl border border-white/10 overflow-hidden select-none touch-none"
              onMouseMove={updateDragPosition}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
              onTouchMove={updateDragPosition}
              onTouchEnd={endDrag}
            >
              {/* Target circle */}
              <div className="absolute left-1/2 top-[42%] -translate-x-1/2 w-16 h-16 border-4 border-dashed border-emerald-400/70 rounded-full" />

              {/* Draggable food can */}
              <div
                className="absolute w-11 h-11 bg-orange-500 rounded-full flex items-center justify-center text-2xl shadow-xl cursor-grab active:cursor-grabbing transition-transform"
                style={{
                  left: `${minigameState.x}%`,
                  top: `${minigameState.y}%`,
                  transform: minigameState.isDragging ? "scale(1.15)" : "scale(1)",
                }}
                onMouseDown={startDrag}
                onTouchStart={startDrag}
              >
                🥫
              </div>

              <div className="absolute bottom-2 text-center w-full text-[10px] text-white/50">
                Sürükleyerek hedefe fırlat
              </div>
            </div>

            {throwResult && (
              <div className={`mt-3 text-center text-sm font-medium ${throwResult.success ? "text-emerald-400" : "text-orange-400"}`}>
                {throwResult.message}
                {!throwResult.success && (
                  <button onClick={resetMinigame} className="ml-3 underline text-white/60">
                    Tekrar dene
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-500">
          {isCameraOn ? (
            "Gerçek TensorFlow.js COCO-SSD modeli ile canlı tespit aktif"
          ) : (
            "Telefon kamerasıyla dene. Işık ve netlik önemli."
          )}
        </div>
      </GlassCard>

      {capturedPhoto && detectionResult && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Bu fotoğraf ileride NFT'ye eklenecek</p>
          <img src={capturedPhoto} alt="Yakalanan" className="mx-auto max-h-36 rounded-xl border border-white/10" />
        </div>
      )}

      <div className="mt-6 text-center text-xs text-gray-500">
        Gerçek kedi/köpek önünde kamerayı sabit tut.
      </div>
    </div>
  );
}
