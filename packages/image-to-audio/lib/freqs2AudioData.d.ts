export type Freqs2AudioOptions = {
    sampleRate: number;
    seconds: number;
};
export declare function freqs2AudioData(freqs: number[], options: Freqs2AudioOptions): Float32Array;
