import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { CameraView as ExpoCamera, useCameraPermissions } from "expo-camera";
import { useState, useRef, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { detectAnimal } from "../lib/detector";
import { generateAnimal, getSpeciesLabel, getSpeciesEmoji, type AnimalSpecies } from "../lib/animals";
import { useStore, type Animal } from "../lib/store";

type Phase = "idle" | "scanning" | "found" | "not-found";

interface CameraViewProps {
  onCatch: (animal: Animal) => void;
  onClose: () => void;
}

export function CameraView({ onCatch, onClose }: CameraViewProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<ExpoCamera>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<{ species: AnimalSpecies; confidence: number } | null>(null);
  const addAnimal = useStore((s) => s.addAnimal);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || phase !== "idle") return;

    setPhase("scanning");

    try {
      // Take photo
      const photo = await cameraRef.current.takePictureAsync({
        base64: false,
        quality: 0.7,
      });

      if (!photo?.uri) {
        setPhase("not-found");
        return;
      }

      // Run detection
      const detection = await detectAnimal(photo.uri);

      if (detection) {
        setResult(detection);
        setPhase("found");

        // Generate animal + save to store
        const animal = generateAnimal(detection.species, photo.uri);
        addAnimal(animal);
        onCatch(animal);
      } else {
        setPhase("not-found");
      }
    } catch (err) {
      console.error("Catch error:", err);
      setPhase("not-found");
    }
  }, [phase, addAnimal, onCatch]);

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
        <Text className="font-body text-text-secondary text-center mt-4 mb-4">
          Kamera izni gerekiyor
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-primary px-8 py-3 rounded-full"
        >
          <Text className="font-display text-white">İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ExpoCamera
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
      >
        {/* Top bar */}
        <View className="flex-row justify-between items-center px-4 pt-12">
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 bg-black/40 rounded-full items-center justify-center"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text className="font-display text-white text-lg">Yakala</Text>
          <View className="w-10" />
        </View>

        {/* Scanning overlay */}
        {phase === "scanning" && (
          <View className="flex-1 items-center justify-center bg-black/30">
            <ActivityIndicator size="large" color="#E8A87C" />
            <Text className="font-body text-white mt-3">Tespit ediliyor...</Text>
          </View>
        )}

        {/* Found result */}
        {phase === "found" && result && (
          <View className="flex-1 items-center justify-center bg-black/50">
            <View className="bg-card-bg rounded-3xl p-6 mx-8 items-center">
              <Text className="text-6xl mb-2">
                {getSpeciesEmoji(result.species)}
              </Text>
              <Text className="font-display text-lg text-text-primary">
                {getSpeciesLabel(result.species)}
              </Text>
              <Text className="font-body text-sm text-text-secondary mt-1">
                Güven: %{Math.round(result.confidence * 100)}
              </Text>
              <Text className="font-body text-xs text-success mt-4">
                ✅ Koleksiyona eklendi!
              </Text>
            </View>
          </View>
        )}

        {/* Not found */}
        {phase === "not-found" && (
          <View className="flex-1 items-center justify-center bg-black/50">
            <View className="bg-card-bg rounded-3xl p-6 mx-8 items-center">
              <Ionicons name="search-outline" size={48} color="#C4956A" />
              <Text className="font-body text-text-secondary text-center mt-3">
                Hiçbir hayvan tespit edilemedi.{'\n'}Tekrar dene!
              </Text>
              <TouchableOpacity
                onPress={() => setPhase("idle")}
                className="bg-primary px-6 py-2 rounded-full mt-4"
              >
                <Text className="font-display text-white text-sm">Tekrar Dene</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom capture button - show only when idle */}
        {phase === "idle" && (
          <View className="absolute bottom-10 left-0 right-0 items-center">
            <TouchableOpacity
              onPress={handleCapture}
              className="w-20 h-20 rounded-full border-4 border-white items-center justify-center"
            >
              <View className="w-16 h-16 rounded-full bg-white" />
            </TouchableOpacity>
            <Text className="font-body text-white text-sm mt-3">
              Hayvanı yakalamak için dokun
            </Text>
          </View>
        )}
      </ExpoCamera>
    </View>
  );
}
