import WebGLDebugUtil from 'webgl-debug';
import fragmentShaderSrc from './shaders/fragment.frag';
import vertexShaderSrc from './shaders/vertex.vert';
import resizeCanvas from './resize-canvas';
import createProgram from './create-program';
import createBuffers from './create-buffers';
import createTexture from './create-texture';
import draw from './draw';

function throwOnGLError(err, funcName) {
  const glErr = WebGLDebugUtil.glEnumToString(err);
  throw new Error(`${glErr} was caused by call to ${funcName}`);
}

const demo = async () => {
  const canvas = document.getElementById('canvas');
  const glNoDebug = canvas.getContext('webgl2', { alpha: true });

  // TODO: Only wrap in development
  const gl = WebGLDebugUtil.makeDebugContext(glNoDebug, throwOnGLError);

  // Setting up shaders
  const shaders = [
    {
      src: fragmentShaderSrc,
      type: gl.FRAGMENT_SHADER
    },
    {
      src: vertexShaderSrc,
      type: gl.VERTEX_SHADER
    },
  ];
  const program = createProgram(gl, shaders);

  // Creating our mesh indices, normals and texture coords
  const buffers = await createBuffers(gl);

  // Array holding our attribute locations
  const attributes = {
    position: gl.getAttribLocation(program, 'a_position'),
    textureCoords: gl.getAttribLocation(program, 'a_uv'),
    barycentrics: gl.getAttribLocation(program, 'a_barycentrics'),
  };

  // Enabling the attributes
  const attributeValues = Object.values(attributes);
  for (let i = 0; i <= attributeValues.length; i += 1) {
    gl.enableVertexAttribArray(attributeValues[i]);
  }

  // Array holding our uniform locations
  const uniforms = {
    proj_matrix: gl.getUniformLocation(program, 'uPMatrix'),
    mv_matrix: gl.getUniformLocation(program, 'uMVMatrix'),
    show_wireframe: gl.getUniformLocation(program, 'uWireframe'),
  };

  // Array holding our texture references
  const textures = {
    arial: await createTexture(gl, 'font/arial/arial.png'),
  };

  gl.useProgram(program);

  // Resize canvas and viewport
  const resize = () => {
    resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  };

  // Canvas resize hook
  window.onresize = resize;
  resize();

  // Start rendering
  requestAnimationFrame(now => draw(gl, now, performance.now(), 0, 0, {
    buffers,
    attributes,
    uniforms,
    textures,
  }));
};

export default demo;
