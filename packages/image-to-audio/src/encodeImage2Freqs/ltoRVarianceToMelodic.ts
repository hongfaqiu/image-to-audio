import { DecodedImage } from "../decodeImage";

/** C Major Scales convert to frequency */
export const C_MAJOR = [
  261.626, 293.665, 329.628, 349.228, 391.995, 440.0, 493.883, 523.251, 587.33,
  659.255, 698.456, 783.991, 880.0, 987.767, 1046.502, 1174.659, 1318.51,
  1396.913, 1567.982, 1760.0, 1975.533,
];
/** C Harmonic Major Scales convert to frequency */
export const C_HARMONIC_MAJOR = [
  261.626, 293.665, 329.628, 349.228, 391.995, 415.305, 493.883, 523.251,
  587.33, 659.255, 698.456, 783.991, 830.609, 987.767, 1046.502, 1174.659,
  1318.51, 1396.913, 1567.982, 1661.219, 1975.533,
];
/** C Melody Major Scales convert to frequency */
export const C_MELODY_MAJOR = [
  261.626, 293.665, 329.628, 349.228, 391.995, 415.305, 466.164, 523.251,
  587.33, 659.255, 698.456, 783.991, 830.609, 932.328, 1046.502, 1174.659,
  1318.51, 1396.913, 1567.982, 1661.219, 1864.655,
];

/** A Minor Scales convert to frequency */
export const A_MINOR = [
  220.0, 246.942, 261.626, 293.665, 329.628, 349.228, 391.995, 440.0, 493.883,
  523.251, 587.33, 659.255, 698.456, 783.991, 880.0, 987.767, 1046.502,
  1174.659, 1318.51, 1396.913, 1567.982,
];
/** A Harmonic Minor Scales convert to frequency */
export const A_HARMONIC_MINOR = [
  220.0, 246.942, 261.626, 293.665, 329.628, 349.228, 415.305, 440.0, 493.883,
  523.251, 587.33, 659.255, 698.456, 830.609, 880.0, 987.767, 1046.502,
  1174.659, 1318.51, 1396.913, 1661.219,
];
/** A Melody Minor Scales convert to frequency */
export const A_MELODY_MINOR = [
  220.0, 246.942, 261.626, 293.665, 329.628, 369.994, 415.305, 440.0, 493.883,
  523.251, 587.33, 659.255, 739.989, 830.609, 880.0, 987.767, 1046.502,
  1174.659, 1318.51, 1479.978, 1661.219,
];

/** Ancient Pentatonic Scales from China convert to frequency */
export const ANCIENT_PENTATONIC = [
  261.626, 293.665, 329.628, 391.995, 440.0, 523.251, 587.33, 659.255, 783.991,
  880.0, 1046.502, 1174.659, 1318.51, 1567.982, 1760.0,
];

export type LtoRVarianceToMelodicOptions = {
  /** an array includes the frequencies of a melodic scale, default to C_MAJOR */
  melodicScales?: number[];
};

function encodePixel(pixels: Uint8Array[]): number {
  let sum = { r: 0, g: 0, b: 0 };
  for (let i = 0; i < pixels.length; i++) {
    const [r, g, b, a] = pixels[i];
    sum.r += r;
    sum.g += g;
    sum.b += b;
  }
  let avg = {
    r: sum.r / pixels.length,
    g: sum.g / pixels.length,
    b: sum.b / pixels.length,
  };
  let variance = { r: 0, g: 0, b: 0 };
  for (let i = 0; i < pixels.length; i++) {
    const [r, g, b, a] = pixels[i];
    variance.r += Math.pow(r - avg.r, 2);
    variance.g += Math.pow(g - avg.g, 2);
    variance.b += Math.pow(b - avg.b, 2);
  }
  variance.r = variance.r / pixels.length;
  variance.g = variance.g / pixels.length;
  variance.b = variance.b / pixels.length;

  const avg_variance = (variance.r + variance.g + variance.b) / 3;

  return avg_variance;
}

function generateFreqs(
  freqMaterials: number[],
  options?: LtoRVarianceToMelodicOptions
): number[] {
  const melodicScales = options?.melodicScales ?? C_MAJOR;

  const max = Math.max.apply(null, freqMaterials);
  const min = Math.min.apply(null, freqMaterials);
  const result = freqMaterials.map((orifreq) => {
    /** if the picture only has one color, all freq will be set as the first value of the melodicScales. */
    if (max === min) return melodicScales[0];

    let freq =
      (melodicScales[melodicScales.length - 1] * (orifreq - min)) / (max - min);
    let mindif = 1661;
    let freqindex = 0;
    for (let index = 0; index < melodicScales.length; index++) {
      if (mindif > Math.abs(melodicScales[index] - freq)) {
        freqindex = index;
        mindif = Math.abs(melodicScales[index] - freq);
      }
    }
    freq = melodicScales[freqindex];
    return freq;
  });
  return result;
}

/**
 * provide a function encode image into number array, which will decode the image vertically from left to right and then encode into sound's frequency array like [220, 440, 880, ...].
 * @param data image data decode from image
 * @param [options.melodicScales = C_MAJOR] an array includes the frequencies of a melodic scale, default to C_MAJOR.
 * @returns sound tone array
 */
export function ltoRVarianceToMelodic(options?: LtoRVarianceToMelodicOptions) {
  return function (data: DecodedImage) {
    const encodeData: Uint8Array[][] = [];
    for (let i = 0; i < data.width; i++) {
      const array = [];
      for (let j = 0; j < data.height; j++) {
        array.push(data.data[j * data.width + i]);
      }
      encodeData.push(array);
    }

    const freqMaterials = encodeData.map((pixels) => encodePixel(pixels));

    const result = generateFreqs(freqMaterials, options);

    return result;
  };
}
