# image-to-audio

![image-to-audio](./pictures/image-to-audio.png)

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
import { imageToAudio } from 'image-to-audio';

const res = await fetch('../assets/mona.jpg')
const buffer = await res.arrayBuffer()

const blob = imageToAudio(buffer).blob
```

### API

This api provides function to simply change image to audio, which will decode the image vertically from left to right and encode pixels to the digital analog signal.

Or you could use the following apis to make up your own decode-encode function, reference the [code](./src/imageToAudio.ts).

#### imageToAudio

```ts
function imageToAudio(input: ImageInputTypes, options?: ImageToAudioOptions): {
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

#### encodeImage2Freqs

Provide a function encode image into number array, and then encode into sound's frequency array like [220, 440, 880, ...]

```ts
function encodeImage2Freqs(data: DecodedImage, options?: EncodeImage2FreqsOptions): number[];

type EncodeImage2FreqsOptions = {
    /** rebuild encode data, defaults arrange from left to right */
    encodeData?: (data: DecodedImage) => Uint8Array[][];
    /** transform pixel [r, g, b, a] to number range in [-1, 1] */
    encodeFunc?: (pixels: Uint8Array[]) => number;
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
