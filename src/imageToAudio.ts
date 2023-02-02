import AudioEncoder from "./AudioEncoder";
import { DecodedImage, decodeImage, ImageInputTypes } from "./decodeImage";
import { encodeImage2Freqs } from "./encodeImage2Freqs";
import { freqs2AudioData } from "./freqs2AudioData";

export type ImageToAudioOptions = {
  mimeType?: string;
  /** rebuild encode data, defaults arrange from left to right */
  encodeData?: (data: DecodedImage) => Uint8Array[][];
  /** transform pixel [r, g, b, a] to number range in [-1, 1] */
  encodeFunc?: (pixels: Uint8Array[]) => number;
  sampleRate?: number;
  seconds?: number;
}

export function imageToAudio(input: ImageInputTypes, options?: ImageToAudioOptions) {
  const opts = {
    sampleRate: 44100,
    seconds: 3,
    ...options,
  }

  const imageData = decodeImage(input, opts.mimeType);

  const freqs = encodeImage2Freqs(imageData, opts);

  const buffer = freqs2AudioData(freqs, opts);

  const encoder = new AudioEncoder({
    sampleRate: opts.sampleRate
  });

  encoder.encode([buffer]);
  
  return encoder.finish();
}