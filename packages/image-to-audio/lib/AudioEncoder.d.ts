export type AudioEncoderOptions = {
    /** sampling rate [Hz], defaults to 44100Hz */
    sampleRate?: number;
    /** number of audio channels, defaults to 1 */
    numChannels?: number;
};
export declare class AudioEncoder {
    readonly sampleRate: number;
    readonly numChannels: number;
    readonly options: AudioEncoderOptions;
    private _dataViews;
    private _numSamples;
    constructor(options?: AudioEncoderOptions);
    get dataViews(): DataView[];
    encode(buffer: Float32Array[]): DataView;
    finish(mimeType?: string): Blob;
    destory(): void;
}
export default AudioEncoder;
