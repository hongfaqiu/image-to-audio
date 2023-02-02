export type Freqs2AudioOptions = {
  sampleRate: number;
  seconds: number;
}

export function freqs2AudioData(freqs: number[], options: Freqs2AudioOptions) {
  const { sampleRate, seconds } = options;
  const totalSamples = sampleRate * seconds;

  const totalWaves = freqs.reduce((totalWaves, freq) => totalWaves + freq, 0);

  let result: number[] = [];

  for (let i = 0; i < totalSamples; i++) {
    const posX = i / totalSamples * freqs.length;
    const index = Math.floor(posX);
    const freq = freqs[index];
    const length = freq / totalWaves;
    const waveX = (posX - index) / length * Math.PI * 2;
    const waveY = Math.sin(waveX);
    result.push(waveY);
  }
  return new Float32Array(result);
}