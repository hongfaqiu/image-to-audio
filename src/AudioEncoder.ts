function setString(view: DataView, offset: number, str: string) {
  var len = str.length;
  for (var i = 0; i < len; ++i)
    view.setUint8(offset + i, str.charCodeAt(i));
};

export type AudioEncoderOptions = {
  /** sampling rate [Hz], defaults to 44100Hz */
  sampleRate?: number;
  /** number of audio channels, defaults to 1 */
  numChannels?: number;
}

export class AudioEncoder {
  readonly sampleRate: number;
  readonly numChannels: number;
  readonly options: AudioEncoderOptions;
  private _dataViews: DataView[] = [];
  private _numSamples = 0;

  constructor(options?: AudioEncoderOptions) {
    this.options = {
      sampleRate: 44100,
      numChannels: 1,
      ...options,
    }
    this.sampleRate = this.options.sampleRate;
    this.numChannels = this.options.numChannels;
  }

  encode(buffer: Float32Array[]) {
    let len = buffer[0].length,
      nCh = this.numChannels,
      view = new DataView(new ArrayBuffer(len * nCh * 2)),
      offset = 0;
    
    for (let i = 0; i < len; ++i)
      for (let ch = 0; ch < nCh; ++ch) {
        const x = buffer[ch][i] * 0x7fff;
        view.setInt16(offset, x < 0 ? Math.max(x, -0x8000) : Math.min(x, 0x7fff), true);
        offset += 2;
      }
    
    this._dataViews.push(view);
    this._numSamples += len;

    return view;
  };

  finish(mimeType: string = 'audio/wav') {
    const dataSize = this.numChannels * this._numSamples * 2,
      view = new DataView(new ArrayBuffer(44));
    
    setString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    setString(view, 8, 'WAVE');
    setString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, this.numChannels, true);
    view.setUint32(24, this.sampleRate, true);
    view.setUint32(28, this.sampleRate * 4, true);
    view.setUint16(32, this.numChannels * 2, true);
    view.setUint16(34, 16, true);
    setString(view, 36, 'data');
    view.setUint32(40, dataSize, true);
    this._dataViews.unshift(view);

    const blob = new Blob(this._dataViews, { type: mimeType });
    this._dataViews = []

    return blob;
  };

  destory() {
    delete this._dataViews;
  }
}

export default AudioEncoder