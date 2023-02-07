import { DecodedImage } from "./decodeImage";

export type EncodeImage2FreqsOptions = {
  /** rebuild encode data, defaults arrange from left to right */
  encodeData?: (data: DecodedImage) => Uint8Array[][];
  /** transform pixel [r, g, b, a] to sound frequency */
  encodeFunc?: (pixels: Uint8Array[], maxFreq?: number) => number;
  /** maximun sound frequency (hz), only used when encodeFunc not defined, defaults to 20000 */
  maxFreq?: number;
}

function encodePixel(pixels: Uint8Array[], maxFreq = 20000): number {
  let total = 0
  const maxSum = 255 * 3 * pixels.length
  for (let i = 0; i < pixels.length; i++) {
    const [r, g, b, a] = pixels[i];
    total += r + g + b;
  }
  const freq = maxFreq * total / maxSum

  return freq
}

/**
 * encode image data to sound frequency array
 * @param data image data decode from image
 * @param [options.encodeData] rebuild encode data, defaults arrange from left to right
 * @param [options.encodeFunc] transform pixel [r, g, b, a] to sound frequency
 * @param [options.maxFreq = 20000] maximun sound frequency (hz), only used when encodeFunc not defined, defaults to 20000
 * @returns sound tone array
 */
export function encodeImage2Freqs(data: DecodedImage, options?: EncodeImage2FreqsOptions) {
  let encodeData: Uint8Array[][] = []
  if (options.encodeData) {
    encodeData = options.encodeData(data)
  } else {
    for (let i = 0; i < data.width; i++) {
      const array = []
      for (let j = 0; j < data.height; j++) {
        array.push(data.data[j * data.width + i])
      }
      encodeData.push(array)
    }
  }

  const encodeFunc = options?.encodeFunc ?? encodePixel

  const result = encodeData.map(pixels => encodeFunc(pixels, options?.maxFreq))
  
  return result;
}