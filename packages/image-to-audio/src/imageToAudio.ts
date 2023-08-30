import AudioEncoder from "./AudioEncoder";
import { DecodedImage, decodeImage, ImageInputTypes } from "./decodeImage";
import { freqs2AudioData } from "./freqs2AudioData";

export type ImageToAudioOptions = {
  mimeType?: string;
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
 * @param encodeImage2Freqs a function, encode image data to sound frequency array
 * @param [options.mimeType]
 * @param [options.sampleRate = 44100] sampling rate [Hz], defaults to 44100Hz
 * @param [options.bpm = 60] Beat Per Minute, defaults to 60
 * @param [options.beat = 1 / 4] beat, defaults to 1/4
 * @returns
 */
export function imageToAudio(input: ImageInputTypes, encodeImage2Freqs: (data: DecodedImage) => number[], options?: ImageToAudioOptions) {
  const opts: ImageToAudioOptions = {
    sampleRate: 44100,
    bpm: 60,
    beat: 1 / 4,
    ...options,
  }

  const imageData = decodeImage(input, opts?.mimeType);

  const freqs = encodeImage2Freqs(imageData);

  const seconds = freqs.length * opts.beat / opts.bpm * 60;

  const buffer = freqs2AudioData(freqs, {
    sampleRate: opts.sampleRate,
    seconds
  });

  const encoder = new AudioEncoder({
    sampleRate: opts.sampleRate
  });

  encoder.encode([buffer]);
  const blob = encoder.finish();

  return {
    imageData,
    freqs,
    buffer,
    blob,
  }
}