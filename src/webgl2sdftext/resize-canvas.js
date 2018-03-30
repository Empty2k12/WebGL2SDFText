/**
 * Resizes the canvas with a specifiable multiplier
 * @param {Canvas} canvas - The canvas.
 * @param {int} mult - Multiplier.
 */
const resizeCanvas = (canvas, mult) => {
  const multiplier = mult || 1;
  const width = canvas.clientWidth * multiplier;
  const height = canvas.clientHeight * multiplier;
  if (canvas.width !== width || canvas.height !== height) {
    // eslint-disable-next-line no-param-reassign
    canvas.width = width;
    // eslint-disable-next-line no-param-reassign
    canvas.height = height;
    return true;
  }
  return false;
};

export default resizeCanvas;
