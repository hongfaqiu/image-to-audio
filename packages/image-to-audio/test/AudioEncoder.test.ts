import { expect } from 'chai';
import { AudioEncoder } from '../src';

describe('encode buffer to blob', () => {
  const encoder = new AudioEncoder()

  const buffer = new Float32Array(44100);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = Math.random()
  }

  it('should encode', () => {
    encoder.encode([buffer])
    expect(encoder.dataViews.length).eql(1)
  })

  it('should return wav blob', () => {
    const blob = encoder.finish()
    expect(blob.type).eql('audio/wav')
  })

  it('should destroyed', () => {
    encoder.destory()
    expect(encoder.dataViews).eql(undefined)
  })

})