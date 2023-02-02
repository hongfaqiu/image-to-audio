import decode from 'image-decode';

export type DecodedImage = {
  data: Uint8Array[];
  width: number;
  height: number;
}

export type ImageInputTypes = ArrayBuffer | Buffer | Uint8Array | string

/** spports PNG, GIF, BMP, JPEG, TIFF */
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