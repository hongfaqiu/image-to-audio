import imageToAudio from '../src';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

const assetsDirectory = path.resolve(process.cwd(), "assets");

describe('image to audio', () => {
  const image = fs.readFileSync(path.join(assetsDirectory, 'mona.jpg'))
  const blob = imageToAudio(image)

  it('should be blob', () => {
    expect(blob instanceof Blob).eql(true)
  })
})