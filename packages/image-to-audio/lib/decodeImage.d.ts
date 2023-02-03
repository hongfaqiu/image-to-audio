/// <reference types="node" />
export type DecodedImage = {
    data: Uint8Array[];
    width: number;
    height: number;
};
export type ImageInputTypes = ArrayBuffer | Buffer | Uint8Array | string;
/**
 * Takes input buffer with encoded image data and decodes its contents.
 * @param input buffer can be any binary data container: ArrayBuffer | Buffer | Uint8Array | base64 string
 * @param mimeType mimeType can be passed to skip image type detection.
 * @returns returns pixels data array with layout [[r, g, b, a], [r, g, b, a], ...]
 */
export declare function decodeImage(input: ImageInputTypes, mimeType?: string): {
    data: Uint8Array[];
    width: number;
    height: number;
};
