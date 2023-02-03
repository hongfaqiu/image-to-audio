import { DecodedImage } from "./decodeImage";
export type EncodeImage2FreqsOptions = {
    /** rebuild encode data, defaults arrange from left to right */
    encodeData?: (data: DecodedImage) => Uint8Array[][];
    /** transform pixel [r, g, b, a] to number range in [-1, 1] */
    encodeFunc?: (pixels: Uint8Array[]) => number;
};
export declare function encodeImage2Freqs(data: DecodedImage, options?: EncodeImage2FreqsOptions): number[];
