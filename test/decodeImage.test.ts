import { decodeImage } from 'image-to-audio';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

const assetsDirectory = path.resolve(process.cwd(), "example/public");

describe('decode image', () => {
  const image = fs.readFileSync(path.join(assetsDirectory, 'mona.jpg'))
  const { data, width, height } = decodeImage(image);

  it('should be decode', () => {
    expect(data[0] instanceof Uint8Array).eql(true)
  })

  it('should be correct width and height', () => {
    expect(data.length).eql(width * height)
  })
})