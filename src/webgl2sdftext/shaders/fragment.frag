#version 300 es
precision mediump float;

in vec2 v_uv;

uniform sampler2D uMainTex;

out vec4 fragmentColor;

const vec4 fontColor = vec4(1.0, 0.0, 0.0, 1.0);

void main(void) {
  vec4 texColor = texture(uMainTex, v_uv);
  fragmentColor = vec4(fontColor.rgb, texColor.a);
  if (texColor.a < 0.5) {
    discard;
  }
}