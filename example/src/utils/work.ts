import { expose } from "threads/worker";
import { imageToAudio, leftToRightRGB } from "image-to-audio";
import {
  ltoRVarianceToMelodic,
  C_MAJOR,
  C_HARMONIC_MAJOR,
  C_MELODY_MAJOR,
  A_MINOR,
  A_HARMONIC_MINOR,
  A_MELODY_MINOR,
} from "image-to-audio";

expose((input, options) => {
  if (options.method === "LeftToRightRGB") {
    return imageToAudio(input, leftToRightRGB(options), options);
  }

  if (options.method === "VarianceToMelodic") {
    let selectedMelodicScales;
    switch (options.melodicScales) {
      case "C_MAJOR":
        selectedMelodicScales = C_MAJOR;
        break;
      case "C_HARMONIC_MAJOR":
        selectedMelodicScales = C_HARMONIC_MAJOR;
        break;
      case "C_MELODY_MAJOR":
        selectedMelodicScales = C_MELODY_MAJOR;
        break;
      case "A_MINOR":
        selectedMelodicScales = A_MINOR;
        break;
      case "A_HARMONIC_MINOR":
        selectedMelodicScales = A_HARMONIC_MINOR;
        break;
      case "A_MELODY_MINOR":
        selectedMelodicScales = A_MELODY_MINOR;
        break;
      default:
        selectedMelodicScales = C_MAJOR;
        break;
    }
    return imageToAudio(
      input,
      ltoRVarianceToMelodic({
        ...options,
        melodicScales: selectedMelodicScales,
      }),
      options
    );
  }
});
