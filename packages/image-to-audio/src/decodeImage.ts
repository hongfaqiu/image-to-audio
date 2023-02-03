import decode from 'image-decode';

export type DecodedImage = {
  data: Uint8Array[];
  width: number;
  height: number;
}

export type ImageInputTypes = ArrayBuffer | Buffer | Uint8Array | string

/**
 * Takes input buffer with encoded image data and decodes its contents. 
 * @param input buffer can be any binary data container: ArrayBuffer | Buffer | Uint8Array | base64 string
 * @param mimeType mimeType can be passed to skip image type detection.
 * @returns returns pixels data array with layout [[r, g, b, a], [r, g, b, a], ...]
 */
export function decodeImage(input: ImageInputTypes, mimeType?: string) {
  const result: {
    data: Uint8Array;
    width: number;
    height: number;
  } = (decode as any)(input, mimeType)

  const data: Uint8Array[] = []
  let index = 0
  while (index < result.data.length) {
    data.push(result.data.slice(index, (index += 4)));
  }

  return {
    ...result,
    data,
  }
}