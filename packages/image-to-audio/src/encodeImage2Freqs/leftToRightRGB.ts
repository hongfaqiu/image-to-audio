import { DecodedImage } from "../decodeImage";

export type LeftToRightRGBOptions = {
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
 * provide a function encode image into number array, which will decode the image vertically from left to right and then encode into sound's frequency array like [220, 440, 880, ...].
 * @param data image data decode from image
 * @param [options.maxFreq = 20000] maximun sound frequency (hz), only used when encodeFunc not defined, defaults to 20000
 * @returns sound tone array
 */
export function leftToRightRGB(options?: LeftToRightRGBOptions) {
  return function (data: DecodedImage) {
    const encodeData: Uint8Array[][] = []
    for (let i = 0; i < data.width; i++) {
      const array = []
      for (let j = 0; j < data.height; j++) {
        array.push(data.data[j * data.width + i])
      }
      encodeData.push(array)
    }
  
    const result = encodeData.map(pixels => encodePixel(pixels, options?.maxFreq))
    
    return result;
  }
}