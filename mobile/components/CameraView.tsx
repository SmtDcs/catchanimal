import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { CameraView as ExpoCamera, useCameraPermissions } from "expo-camera";
import { useState, useRef, useCallback, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { detectAnimal, preloadModel, isModelAvailable } from "../lib/detector";
import { generateAnimal, getSpeciesLabel, getSpeciesEmoji, type AnimalSpecies } from "../lib/animals";
import { useStore, type Animal } from "../lib/store";
import { CatchGame } from "./CatchGame";

type Phase = "loading-model" | "idle" | "scanning" | "game" | "found" | "not-found" | "model-error";

interface CameraViewProps {
  onCatch: (animal: Animal) => void;
  onClose: () => void;
}

export function CameraView({ onCatch, onClose }: CameraViewProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<ExpoCamera>(null);
  const [phase, setPhase] = useState<Phase>("loading-model");
  const [detectedSpecies, setDetectedSpecies] = useState<AnimalSpecies | null>(null);
  const [detectedConfidence, setDetectedConfidence] = useState(0);
  const [lastPhotoUri, setLastPhotoUri] = useState("");
  const addAnimal = useStore((s) => s.addAnimal);
  const updatePlayer = useStore((s) => s.updatePlayer);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phase === "loading-model") {
        setPhase("model-error"); // 10sn sonra hala yükleniyorsa hata göster
      }
    }, 10000);
    preloadModel().then(() => { clearTimeout(timer); if (phase === "loading-model") setPhase("idle"); }).catch(() => { clearTimeout(timer); if (phase === "loading-model") setPhase("model-error"); });
  }, []);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || phase !== "idle") return;
    setPhase("scanning");

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: false, quality: 0.5 });
      if (!photo?.uri) { setPhase("not-found"); return; }

      const detection = await detectAnimal(photo.uri);
      if (detection) {
        setDetectedSpecies(detection.species);
        setDetectedConfidence(detection.confidence);
        setLastPhotoUri(photo.uri);
        setPhase("game");
      } else {
        setPhase("not-found");
      }
    } catch (err) {
      console.error("Catch error:", err);
      setPhase("not-found");
    }
  }, [phase]);

  const handleGameSuccess = useCallback(() => {
    if (!detectedSpecies) return;
    const animal = generateAnimal(detectedSpecies, lastPhotoUri);
    addAnimal(animal);
    updatePlayer({ coins: 10 });
    setPhase("found");
    setTimeout(() => { onCatch(animal); setPhase("idle"); setDetectedSpecies(null); }, 2000);
  }, [detectedSpecies, lastPhotoUri, addAnimal, updatePlayer, onCatch]);

  const handleGameFail = useCallback(() => {
    setPhase("idle");
    setDetectedSpecies(null);
  }, []);

  const resetToIdle = useCallback(() => { setPhase("idle"); setDetectedSpecies(null); }, []);

  if (!permission) {
    return (
      <View className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator size="large" color="#C4956A" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-cream items-center justify-center px-6">
        <Ionicons name="camera-outline" size={64} color="#C4956A" />
        <Text className="font-body text-text-secondary text-center mt-4 mb-4">Kamera izni gerekiyor</Text>
        <TouchableOpacity onPress={requestPermission} className="bg-primary px-8 py-3 rounded-full">
          <Text className="font-display text-white">İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Camera - always mounted in background */}
      <ExpoCamera ref={cameraRef} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} facing="back" />

      {/* Top bar - always visible */}
      <View className="flex-row justify-between items-center px-4 pt-12">
        <TouchableOpacity
          onPress={phase === "game" ? resetToIdle : onClose}
          className="w-10 h-10 bg-black/40 rounded-full items-center justify-center"
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text className="font-display text-white text-lg">Yakala</Text>
        <View className="w-10" />
      </View>

      {/* Content area */}
      <View className="flex-1">
        {/* Loading */}
        {phase === "loading-model" && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#E8A87C" />
            <Text className="font-body text-white mt-3">AI Modeli yükleniyor...</Text>
            <Text className="font-body text-white/60 text-xs mt-1">İnternetten indiriliyor, ilk seferde 10-30sn sürebilir</Text>
          </View>
        )}

        {/* Model error - fallback to simulated detection */}
        {phase === "model-error" && (
          <View className="flex-1 items-center justify-center">
            <View className="bg-card-bg rounded-3xl p-6 mx-8 items-center">
              <Ionicons name="warning-outline" size={48} color="#FF9800" />
              <Text className="font-body text-text-secondary text-center mt-3">
                AI modeli yüklenemedi. Simülasyon modunda devam ediliyor.
              </Text>
              <TouchableOpacity onPress={() => { setPhase("idle"); }} className="bg-primary px-6 py-2 rounded-full mt-4">
                <Text className="font-display text-white text-sm">Devam Et</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Scanning */}
        {phase === "scanning" && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#E8A87C" />
            <Text className="font-body text-white mt-3">Tespit ediliyor...</Text>
          </View>
        )}

        {/* Game */}
        {phase === "game" && detectedSpecies && (
          <CatchGame species={detectedSpecies} onSuccess={handleGameSuccess} onFail={handleGameFail} difficulty={1} />
        )}

        {/* Found */}
        {phase === "found" && detectedSpecies && (
          <View className="flex-1 items-center justify-center">
            <View className="bg-card-bg rounded-3xl p-6 mx-8 items-center">
              <Text className="text-6xl mb-2">{getSpeciesEmoji(detectedSpecies)}</Text>
              <Text className="font-display text-lg text-text-primary">{getSpeciesLabel(detectedSpecies)} Yakalandı! 🎉</Text>
              <Text className="font-body text-xs text-text-secondary mt-1">%{Math.round(detectedConfidence * 100)} güven</Text>
              <Text className="font-body text-xs text-success mt-3">✅ Koleksiyona eklendi +10 🪙</Text>
            </View>
          </View>
        )}

        {/* Not found */}
        {phase === "not-found" && (
          <View className="flex-1 items-center justify-center">
            <View className="bg-card-bg rounded-3xl p-6 mx-8 items-center">
              <Ionicons name="search-outline" size={48} color="#C4956A" />
              <Text className="font-body text-text-secondary text-center mt-3">Hiçbir hayvan tespit edilemedi.{'\n'}Tekrar dene!</Text>
              <TouchableOpacity onPress={() => setPhase("idle")} className="bg-primary px-6 py-2 rounded-full mt-4">
                <Text className="font-display text-white text-sm">Tekrar Dene</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Capture button */}
      {phase === "idle" && (
        <View className="absolute bottom-10 left-0 right-0 items-center">
          <TouchableOpacity onPress={handleCapture} className="w-20 h-20 rounded-full border-4 border-white items-center justify-center">
            <View className="w-16 h-16 rounded-full bg-white" />
          </TouchableOpacity>
          <Text className="font-body text-white text-sm mt-3">Hayvanı yakalamak için dokun</Text>
        </View>
      )}
    </View>
  );
}
