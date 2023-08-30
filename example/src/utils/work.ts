import { imageToAudio, leftToRightRGB } from "image-to-audio"
import { expose } from "threads/worker"

expose((input, options) => imageToAudio(input, leftToRightRGB(options), options))