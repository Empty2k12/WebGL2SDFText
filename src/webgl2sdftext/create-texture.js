/**
 * Creates a texture reference and uploads the texture to the GPU
 * @param {WebGL2RenderingContext} gl - The gl instance.
 * @param {string} texturePath - Relative path of the texture.
 */
const createTexture = (gl, texturePath) => new Promise(((resolve) => {
  const texture = gl.createTexture();
  texture.image = new Image();
  texture.image.onload = function onload() {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    resolve(texture);
  };
  texture.image.src = texturePath;
}));

export default createTexture;
