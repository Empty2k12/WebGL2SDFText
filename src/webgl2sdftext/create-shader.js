/**
 * Creates, compiles and verifies a shader
 * @param {WebGL2RenderingContext} gl - The gl instance.
 * @param {string} sourceCode - GLSL shder source code.
 * @param {int} type - Either `gl.FRAGMENT_SHADER` or `gl.VERTEX_SHADER`.
 */
const createShader = (gl, sourceCode, type) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    throw new Error(`Could not compile WebGL program. \n\n${info}`);
  }
  return shader;
};

export default createShader;
