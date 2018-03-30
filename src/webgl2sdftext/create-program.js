import createShader from './create-shader';

/**
 * Creates a shader program.
 * @param {WebGL2RenderingContext} gl - The gl instance.
 * @param {array} shaderData - Shader data.
 */
const createProgram = (gl, shaderData) => {
  const program = gl.createProgram();

  shaderData
    .map(s => createShader(gl, s.src, s.type))
    .forEach(s => gl.attachShader(program, s));

  gl.linkProgram(program);

  return program;
};

export default createProgram;
