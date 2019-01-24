#version 300 es

in vec3 a_position;
in vec2 a_uv;
in vec3 a_barycentrics;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

out vec2 v_uv;
out vec3 v_bc;

const float pi = 3.14159265;

void main() {
  v_uv = a_uv;
  v_bc = a_barycentrics;

  vec3 displacedPosition = a_position;
  gl_Position = uPMatrix * uMVMatrix * vec4(a_position, 1.0);
}