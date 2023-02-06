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
  /** Beat Per Minute, defaults to 60 */
  bpm?: number;
  /** beat, defaults to 1/4 */
  beat?: number;
}

/**
 * This api provides function to simply change image to audio, which will decode the image vertically from left to right and encode pixels to the digital analog signal.
 * @param input buffer can be any binary data container: ArrayBuffer | Buffer | Uint8Array | base64 string
 * @param [options.mimeType]
 * @param [options.encodeData] rebuild encode data, defaults arrange from left to right
 * @param [options.encodeFunc] transform pixel [r, g, b, a] to number range in [-1, 1]
 * @param [options.sampleRate = 44100] sampling rate [Hz], defaults to 44100Hz
 * @param [options.bpm = 60] Beat Per Minute, defaults to 60
 * @param [options.beat = 1 / 4] beat, defaults to 1/4
 * @returns wav audio data(Blob)
 */
export function imageToAudio(input: ImageInputTypes, options?: ImageToAudioOptions) {
  const opts = {
    sampleRate: 44100,
    bpm: 60,
    beat: 1 / 4,
    ...options,
  }

  const imageData = decodeImage(input, opts?.mimeType);

  const freqs = encodeImage2Freqs(imageData, opts);

  const seconds = freqs.length * opts.beat / opts.bpm * 60;

  const buffer = freqs2AudioData(freqs, {
    sampleRate: opts.sampleRate,
    seconds
  });

  const encoder = new AudioEncoder({
    sampleRate: opts.sampleRate
  });

  encoder.encode([buffer]);
  
  return encoder.finish();
}