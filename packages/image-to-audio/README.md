# image-to-audio

<img width="1213" alt="image" src="https://github.com/RogerWQH2023/image-to-audio/assets/140324071/5b65a44c-e39c-4514-a9cd-1ec64736e3dd">

Encode an image(PNG, GIF, BMP, JPEG, TIFF) into music

![npm latest version](https://img.shields.io/npm/v/image-to-audio.svg) ![license](https://img.shields.io/npm/l/image-to-audio)

## Install  

```bash
#npm
npm install --save image-to-audio
```

Browser(umd) dont support yet.

### Usage

```ts
import { imageToAudio, leftToRightRGB } from 'image-to-audio';

const res = await fetch('../assets/mona.jpg')
const buffer = await res.arrayBuffer()

const blob = imageToAudio(buffer, leftToRightRGB()).blob
```

### API

#### imageToAudio

This api provides function to simply change image to audio, you must pass the `encodeImage2Freqs` parameter to convert the image into a series of sound frequencies.

We provide some default functions to handle this process, such as [leftToRightRGB](#lefttorightrgb).

```ts
/**
 * @param input buffer can be any binary data container: ArrayBuffer | Buffer | Uint8Array | base64 string
 * @param encodeImage2Freqs a function, encode image data to sound frequency array
 * @param options
 * @returns
 */
function imageToAudio(input: ImageInputTypes, encodeImage2Freqs: (data: DecodedImage) => number[], options?: ImageToAudioOptions): {
    imageData: {
        data: Uint8Array[];
        width: number;
        height: number;
    };
    freqs: number[];
    buffer: Float32Array;
    blob: Blob;
};

type ImageToAudioOptions = {
  mimeType?: string;
  /** sampling rate [Hz], defaults to 44100Hz */
  sampleRate?: number;
  /** Beat Per Minute, defaults to 60 */
  bpm?: number;
  /** beat, defaults to 1/4 */
  beat?: number;
}

type ImageInputTypes = ArrayBuffer | Buffer | Uint8Array | string;
```

#### decodeImage

Decode image data from raw encoded binary data in any image format: PNG, GIF, BMP, JPEG, TIFF.

For more details, see <https://github.com/dy/image-decode>

```ts
/**
 * Takes input buffer with encoded image data and decodes its contents. 
 * @param input buffer can be any binary data container: ArrayBuffer | Buffer | Uint8Array | base64 string
 * @param mimeType mimeType can be passed to skip image type detection.
 * @returns returns pixels data array with layout [[r, g, b, a], [r, g, b, a], ...]
 */
function decodeImage(input: ImageInputTypes, mimeType?: string): DecodedImage;

type DecodedImage = {
    data: Uint8Array[];
    width: number;
    height: number;
};
```

#### AudioEncoder

Wav audio encoder, for more details, see <https://github.com/higuma/wav-audio-encoder-js>

```ts
class AudioEncoder {
    readonly sampleRate: number;
    readonly numChannels: number;
    readonly options: AudioEncoderOptions;

    constructor(options?: AudioEncoderOptions);
    get dataViews(): DataView[];
    encode(buffer: Float32Array[]): DataView;
    finish(mimeType?: string): Blob;
    destory(): void;
}

type AudioEncoderOptions = {
    /** sampling rate [Hz], defaults to 44100Hz */
    sampleRate?: number;
    /** number of audio channels, defaults to 1 */
    numChannels?: number;
};
```

#### freqs2AudioData

Provides a function to arragement sound's frequency(tone) array into wav audio data.

```ts
function freqs2AudioData(freqs: number[], options: Freqs2AudioOptions): Float32Array;

type Freqs2AudioOptions = {
    /** sampling rate [Hz] */
    sampleRate: number;
    /** seconds of the audio */
    seconds: number;
};
```

#### leftToRightRGB

Provide a function encode image into number array, which will decode the image vertically from left to right and then encode into sound's frequency array like [220, 440, 880, ...].

Or you could use the following apis to make up your own decode-encode function, reference the [code](./src/encodeImage2Freqs/leftToRightRGB.ts).

```ts
function leftToRightRGB(options?: defaultFucOptions): (data: DecodedImage) => number[];

type defaultFucOptions = {
  /** maximun sound frequency (hz), only used when encodeFunc not defined, defaults to 20000 */
  maxFreq?: number;
}
```

#### ltoRVarianceToMelodic

Provide a function encode image into number array, which involves calculating the mean of the variances of RGB values in each column of an image, and allocating these values proportionally onto musical scales, such as C Major Scales, A Minor Scales and etc. Reference the [code](./src/encodeImage2Freqs/ltoRVarianceToMelodic.ts).

```ts
function ltoRVarianceToMelodic(options?: LtoRVarianceToMelodicOptions): (data: DecodedImage) => number[];

type LtoRVarianceToMelodicOptions = {
    /** an array includes the frequencies of a melodic scale, default to C_MAJOR */
    melodicScales?: number[];
};
```

## Test

for node 18 run

```bash
pnpm test
```

## Demo

[online Demo](https://image-to-audio.vercel.app/)

Launch the app in the example folder, and then visit <http://localhost:3000/>

```node
pnpm install
cd example
pnpm start
```

## Credits

<https://github.com/alexadam/img-encode>

<https://github.com/higuma/wav-audio-encoder-js>
