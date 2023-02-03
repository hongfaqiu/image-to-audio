import { DecodedImage, ImageInputTypes } from "./decodeImage";
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
};
export declare function imageToAudio(input: ImageInputTypes, options?: ImageToAudioOptions): Blob;
