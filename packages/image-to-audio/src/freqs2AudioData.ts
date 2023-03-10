export type Freqs2AudioOptions = {
  sampleRate: number;
  seconds: number;
}

/**
 * arragement sound's frequency(tone) array into wav audio data
 * @param freqs array of sound frequency
 * @param [options.sampleRate] sampling rate [Hz]
 * @params [options.seconds] seconds of the audio
 */
export function freqs2AudioData(freqs: number[], options: Freqs2AudioOptions) {
  const { sampleRate, seconds } = options;
  const totalSamples = sampleRate * seconds;

  const result: number[] = [];
  const eachFreqSamples = totalSamples / freqs.length;
  const eachFreqSeconds = seconds / freqs.length;

  for (let i = 0; i < freqs.length; i++) {
    const freq = freqs[i];
    const freqWaveLength = ~~(freq * eachFreqSeconds) * Math.PI * 2;
    
    for (let j = 0; j < eachFreqSamples; j++) {
      const waveX = (j / eachFreqSamples) * freqWaveLength
      const waveY = Math.sin(waveX);
      result.push(waveY);
    }
  }
  
  return new Float32Array(result);
}