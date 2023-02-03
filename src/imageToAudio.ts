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
  /** sampling rate [Hz], defaults to 44100Hz */
  sampleRate?: number;
  /** seconds of the audio, defaults to image's width / 10 */
  seconds?: number;
}

export function imageToAudio(input: ImageInputTypes, options?: ImageToAudioOptions) {

  const imageData = decodeImage(input, options?.mimeType);

  const seconds = imageData.width / 10;

  const opts = {
    sampleRate: 44100,
    seconds,
    ...options,
  }

  const freqs = encodeImage2Freqs(imageData, opts);

  const buffer = freqs2AudioData(freqs, opts);

  const encoder = new AudioEncoder({
    sampleRate: opts.sampleRate
  });

  encoder.encode([buffer]);
  
  return encoder.finish();
}