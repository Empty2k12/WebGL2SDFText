#version 300 es
precision mediump float;

in vec2 v_uv;
in vec3 v_bc;

uniform sampler2D uMainTex;
uniform float uWireframe;

out vec4 fragmentColor;

const vec4 fontColor = vec4(1.0, 0.0, 0.0, 1.0);

float edgeFactor(){
    vec3 d = fwidth(v_bc);
    vec3 a3 = smoothstep(vec3(0.0), d*1.5, v_bc);
    return min(min(a3.x, a3.y), a3.z);
}

void main(void) {
  vec4 texColor = texture(uMainTex, v_uv);
  fragmentColor = vec4(fontColor.rgb, texColor.a);

  if (any(lessThan(v_bc, vec3(0.02))) && bool(uWireframe)) {
    fragmentColor = vec4(mix(vec3(1.0), vec3(0.5), edgeFactor()), 1.0);
  } else if (texColor.a > 0.5) {
    fragmentColor = vec4(1.0, 0.0, 0.0, 1.0);
  } else {
    discard;
  }
}