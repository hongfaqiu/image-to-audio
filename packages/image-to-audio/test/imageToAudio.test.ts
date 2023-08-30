import { imageToAudio, leftToRightRGB } from '../src';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

const assetsDirectory = path.resolve(process.cwd(), "example/public");

describe('image to audio', () => {
  const image = fs.readFileSync(path.join(assetsDirectory, 'mona.jpg'))
  const blob = imageToAudio(image, leftToRightRGB()).blob

  it('should be wav blob', () => {
    expect(blob.type).eql('audio/wav')
  })
})