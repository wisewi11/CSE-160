import "./styles.css";
import { initShaders } from "../lib/cuon-utils";
import { Matrix4 } from "../lib/cuon-matrix-cse160";

// Vertex shader program
const VSHADER_SOURCE = `
  attribute vec2 aPosition;
  uniform mat4 uModelMatrix;
  void main() {
    gl_Position = uModelMatrix * vec4(aPosition, 0.0, 1.0);
  }
`;

// Fragment shader program
const FSHADER_SOURCE = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;

// Retrieve <canvas> element
var canvas = document.getElementById("webgl");

// Get the rendering context for WebGL
var gl = canvas.getContext("webgl");
if (!gl) {
  console.error("Failed to get the rendering context for WebGL");
}

// Initialize shaders
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  console.error("Failed to initialize shaders.");
}

// Set clear color
gl.clearColor(0.2, 0.2, 0.2, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Define triangle vertices
const vertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5]);

// Create buffer
const vertexBuffer = gl.createBuffer();
if (!vertexBuffer) {
  console.error("Failed to create the buffer object");
}

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Get attribute location
const aPosPtr = gl.getAttribLocation(gl.program, "aPosition");
if (aPosPtr < 0) {
  console.error("Could not find aPosition ptr");
}

gl.vertexAttribPointer(aPosPtr, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosPtr);

// Function to draw a spaceship
function drawSpaceship(gl, matrix) {
  const uModelMatrixPtr = gl.getUniformLocation(gl.program, "uModelMatrix");

  // Square1
  const M1 = new Matrix4(matrix); // Start with the input matrix
  M1.translate(0, 0, 0);
  M1.scale(0.35, 0.35, 0.35);
  M1.rotate(0, 0, 0, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M1.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // Square2
  const M2 = new Matrix4(matrix);
  M2.translate(0, 0.0, 0);
  M2.scale(0.35, 0.35, 0.35);
  M2.rotate(180, 0, 0, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M2.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // Triangle1
  const M3 = new Matrix4(matrix);
  M3.translate(0, 0.18, 0);
  M3.scale(0.25, 0.35, 0.35);
  M3.rotate(225, 0, 0, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M3.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // Little square 1
  const M4 = new Matrix4(matrix);
  M4.translate(0, -0.26, 0);
  M4.scale(0.15, 0.15, 0.15);
  M4.rotate(0, 0, 0, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M4.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // Little square 2
  const M5 = new Matrix4(matrix);
  M5.translate(0, -0.26, 0);
  M5.scale(0.15, 0.15, 0.15);
  M5.rotate(180, 0, 0, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M5.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // Left triangle 1
  const M6 = new Matrix4(matrix);
  M6.translate(-0.09, -0.32, 0);
  M6.scale(0.2, 0.2, 0.2);
  M6.rotate(-47, 0, 0, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M6.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // Right triangle 1
  const M7 = new Matrix4(matrix);
  M7.translate(0.09, -0.32, 0);
  M7.scale(0.2, 0.2, 0.2);
  M7.rotate(135, 0, 0, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M7.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // Bottom right triangle
  const M8 = new Matrix4(matrix);
  M8.translate(0.24, -0.47, 0);
  M8.scale(0.2, 0.2, 0.2);
  M8.rotate(-45, 0, 0, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M8.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // Bottom left triangle
  const M9 = new Matrix4(matrix);
  M9.translate(-0.24, -0.47, 0);
  M9.scale(0.2, 0.2, 0.2);
  M9.rotate(135, 0, 0, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M9.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// Create matrices for additional spaceships
const M10 = new Matrix4();
M10.setTranslate(-0.5, -0.5, 0);
M10.scale(0.35, 0.35, 0.35);
M10.rotate(-10, 0, 0, 1);
drawSpaceship(gl, M10);

const M11 = new Matrix4();
M11.setTranslate(0.5, -0.25, 0);
M11.scale(0.46, 0.46, 0.46);
M11.rotate(-5, 0, 0, 1);
drawSpaceship(gl, M11);

const M12 = new Matrix4();
M12.setTranslate(-0.15, 0.25, 0);
M12.scale(0.90, 0.90, 0.90);
M12.rotate(-1, 0, 0, 1);
drawSpaceship(gl, M12);
