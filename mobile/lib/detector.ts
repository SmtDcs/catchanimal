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
  cat: "cat",
  dog: "dog",
  bird: "bird",
  horse: "horse",
  sheep: "sheep",
  cow: "cow",
  elephant: "elephant",
  bear: "bear",
  zebra: "zebra",
  giraffe: "giraffe",
};

let model: cocoSsd.ObjectDetection | null = null;
let modelLoading = false;

async function getModel(): Promise<cocoSsd.ObjectDetection> {
  if (model) return model;
  if (modelLoading) {
    while (modelLoading) await new Promise((r) => setTimeout(r, 200));
    return model!;
  }

  modelLoading = true;
  try {
    await tf.ready();
    console.log("TF.js backend:", tf.getBackend());

    if (tf.getBackend() !== "webgl") {
      try {
        await tf.setBackend("webgl");
      } catch {
        console.warn("WebGL not available, using CPU");
        await tf.setBackend("cpu");
      }
    }

    model = await cocoSsd.load({ base: "mobilenet_v2" });
    return model;
  } finally {
    modelLoading = false;
  }
}

/**
 * Base64 string'i Uint8Array'e çevir (Hermes/RN uyumlu)
 */
function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function imageToTensorAsync(uri: string): Promise<{
  tensor: tf.Tensor3D;
  width: number;
  height: number;
}> {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const rawImageData = jpeg.decode(base64ToBytes(base64));

  const { width, height, data } = rawImageData;

  // data is Uint8Array in RGBA format [height, width, 4]
  const tensor = tf.tensor3d(data, [height, width, 4]);

  // COCO-SSD expects RGB (3 channels), slice first 3 channels
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
  await getModel();
}
