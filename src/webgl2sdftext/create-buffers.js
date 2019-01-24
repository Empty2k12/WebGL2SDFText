import SignedDistanceFont from './SignedDistanceFont';

const createBuffers = async (gl) => {
  function readTextFile(file) {
    return new Promise(((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.overrideMimeType('application/json');
      xhr.open('GET', file, true);
      xhr.onreadystatechange = function onreadystatechange() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(xhr.response);
        }
      };
      xhr.send();
    }));
  }

  const fontInfo = await readTextFile('font/arial/arial.json');

  const font = new SignedDistanceFont([
    'WebGL',
    'SDF Font Rendering',
    'Test',
  ], {
    fontInfo: JSON.parse(fontInfo),
    alignment: 'center',
    scale: 1,
  });

  const cubeVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(font.mesh.vertices), gl.STATIC_DRAW);
  cubeVertexPositionBuffer.itemSize = 3;
  cubeVertexPositionBuffer.numItems = font.mesh.vertices.length;

  const cubeVertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(font.mesh.textureCoords), gl.STATIC_DRAW);
  cubeVertexTextureCoordBuffer.itemSize = 2;
  cubeVertexTextureCoordBuffer.numItems = font.mesh.textureCoords.length;

  const cubeVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(font.mesh.indices), gl.STATIC_DRAW);
  cubeVertexIndexBuffer.itemSize = 1;
  cubeVertexIndexBuffer.numItems = font.mesh.indices.length;

  const cubeVertexBarycentricBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBarycentricBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(font.mesh.barycentrics), gl.STATIC_DRAW);
  cubeVertexBarycentricBuffer.itemSize = 3;
  cubeVertexBarycentricBuffer.nimItems = font.mesh.barycentrics.length;

  return {
    cubeVertexPositionBuffer,
    cubeVertexTextureCoordBuffer,
    cubeVertexIndexBuffer,
    cubeVertexBarycentricBuffer
  };
};

export default createBuffers;
