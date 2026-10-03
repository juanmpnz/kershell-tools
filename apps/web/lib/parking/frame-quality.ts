/** Conservative blank-frame guard, not a measure of detection accuracy. */
export function frameIsUsable(pixels: Uint8ClampedArray): boolean {
  if (!pixels.length || pixels.length % 4 !== 0) return false;
  let sum = 0;
  let squaredSum = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 250) return false;
    const luminance = 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
    sum += luminance;
    squaredSum += luminance * luminance;
  }
  const count = pixels.length / 4;
  const mean = sum / count;
  const variance = Math.max(0, squaredSum / count - mean * mean);
  return mean >= 15 && mean <= 245 && variance >= 64;
}
