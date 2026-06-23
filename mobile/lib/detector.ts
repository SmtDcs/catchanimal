import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as jpeg from "jpeg-js";
import * as FileSystem from "expo-file-system";
import type { AnimalSpecies } from "./animals";

export interface DetectionResult {
  species: AnimalSpecies;
  confidence: number;
}

const ANIMAL_CLASSES: Record<string, AnimalSpecies> = {
  cat: "cat", dog: "dog", bird: "bird", horse: "horse",
  sheep: "sheep", cow: "cow", elephant: "elephant", bear: "bear",
  zebra: "zebra", giraffe: "giraffe",
};

let model: cocoSsd.ObjectDetection | null = null;
let modelLoading = false;

/**
 * TF.js'i React Native'de çalıştırmak için gerekli platform kurulumu.
 * - fetch flag'i register edilmezse tf.io.http model.json'u indiremez.
 * - CPU backend kullanıyoruz (WebGL Expo Go'da kararlı değil).
 */
async function setupTF() {
  // Register 'fetch' flag so tf.io.http can download model files
  try {
    tf.env().registerFlag("fetch", () => globalThis.fetch);
  } catch {
    // Already registered
  }

  await tf.ready();
  await tf.setBackend("cpu");
}

async function getModel(): Promise<cocoSsd.ObjectDetection> {
  if (model) return model;
  if (modelLoading) {
    while (modelLoading) await new Promise((r) => setTimeout(r, 200));
    if (model) return model;
    throw new Error("Model load failed");
  }

  modelLoading = true;
  try {
    await setupTF();

    // Model yükleme 30sn timeout
    model = await Promise.race([
      cocoSsd.load({ base: "lite_mobilenet_v2" }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Model load timeout")), 30000)
      ),
    ]);

    return model;
  } catch (err) {
    console.error("Model load error:", err);
    modelLoading = false;
    throw err;
  } finally {
    modelLoading = false;
  }
}

function base64ToBytes(base64: string): Uint8Array {
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
  return bytes;
}

async function imageToTensorAsync(uri: string) {
  let base64: string;
  try {
    base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } catch {
    base64 = await FileSystem.readAsStringAsync(uri.replace("file://", ""), {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  const rawImageData = jpeg.decode(base64ToBytes(base64));
  const { width, height, data } = rawImageData;

  const tensor = tf.tensor3d(data, [height, width, 4]);
  const rgb = tf.slice(tensor, [0, 0, 0], [height, width, 3]);
  tensor.dispose();

  return { tensor: rgb, width, height };
}

export async function detectAnimal(photoUri: string): Promise<DetectionResult | null> {
  try {
    const m = await getModel();
    const { tensor } = await imageToTensorAsync(photoUri);

    const predictions = await m.detect(tensor as any);
    tensor.dispose();

    for (const pred of predictions) {
      const cls = pred.class.toLowerCase();
      const species = ANIMAL_CLASSES[cls];
      if (species && pred.score >= 0.45) {
        return { species, confidence: pred.score };
      }
    }

    return null;
  } catch (err) {
    console.error("Detection error:", err);
    return null;
  }
}

export async function preloadModel(): Promise<void> {
  await getModel().catch(() => {});
}

export function isModelAvailable(): boolean {
  return model !== null;
}
