var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`


var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL() {
  
  canvas = document.getElementById('webgl');
  
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}

function connectVarGLSL() {
 
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }


  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }


  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }


  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

 
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function conversion(ev) {
  var x = ev.clientX; 
  var y = ev.clientY; 
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return [x,y];
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_segments = 10;
let g_selectedType = POINT;
let g_globalAngle = 0;
let g_globalAnglex = 0;
let g_leftArm = 0;
let g_rightArm = 0;
let g_leftLeg = 0;
let g_leftFeet = 0;
let g_rightLeg = 0;
let g_rightFeet = 0;
let g_animationLeftHand = false;
let g_animationRightHand = false;
let g_animationLeftLeg = false;
let g_animationRightLeg = false;
let g_animateAll = false;

function addActionsForHtmlUI() {

    
    document.getElementById('leftArm').addEventListener('mousemove',   function() {g_leftArm = this.value; renderShapes();});
    document.getElementById('rightArm').addEventListener('mousemove',   function() {g_rightArm = this.value; renderShapes();});
    document.getElementById('leftLeg').addEventListener('mousemove',   function() {g_leftLeg = this.value; renderShapes();});
    document.getElementById('leftFeet').addEventListener('mousemove',   function() {g_leftFeet = this.value; renderShapes();});
    document.getElementById('rightLeg').addEventListener('mousemove',   function() {g_rightLeg = this.value; renderShapes();});
    document.getElementById('rightFeet').addEventListener('mousemove',   function() {g_rightFeet = this.value; renderShapes();});
    document.getElementById('animationOnButton1').onclick = function() {g_animationLeftHand = true;};
    document.getElementById('animationOffButton1').onclick = function() {g_animationLeftHand = false;};
    document.getElementById('animationOnButton2').onclick = function() {g_animationRightHand = true;};
    document.getElementById('animationOffButton2').onclick = function() {g_animationRightHand = false;};
    document.getElementById('animationOnButton3').onclick = function() {g_animationLeftLeg = true;};
    document.getElementById('animationOffButton3').onclick = function() {g_animationLeftLeg = false;};
    document.getElementById('animationOnButton4').onclick = function() {g_animationRightLeg = true;};
    document.getElementById('animationOffButton4').onclick = function() {g_animationRightLeg = false;};
    document.getElementById('animationOnButton5').onclick = function() {g_animateAll = true;};
    document.getElementById('animationOffButton5').onclick = function() {g_animateAll = false;};
    document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAnglex = this.value; renderShapes(); });
}

function main() {
  setupWebGL();
  connectVarGLSL();
  addActionsForHtmlUI();
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {if (ev.buttons == 1) { click(ev)}};
  gl.clearColor(.565, 0.835, 1.0, 1.0);
  renderShapes();
  requestAnimationFrame(tick);
}

var g_shapesList = [];

function click(ev) {
  let [x,y] = conversion(ev);

  g_globalAngle = y * 100;
  g_globalAnglex = x *100;
  renderShapes();
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick() {
  g_seconds = performance.now()/1000.0 - g_startTime;
  updateAnimations();
  renderShapes();
  requestAnimationFrame(tick);
}

function updateAnimations() {
  if (g_animationLeftHand) {
    g_leftArm = (5*Math.sin(3*g_seconds));
  }
  if (g_animationRightHand) {
    g_rightArm = (5*Math.sin(3*g_seconds));
  }
  if (g_animationLeftLeg) {
    g_leftLeg = (10*Math.sin(2*g_seconds));
  }
  if (g_animationRightLeg) {
    g_rightLeg = (-10*Math.sin(2*g_seconds));
  }
  if (g_animateAll) {
    g_leftArm = (5*Math.sin(3*g_seconds));
    g_rightArm = (5*Math.sin(3*g_seconds));
    g_leftLeg = (10*Math.sin(2*g_seconds));
    g_rightLeg = (-10*Math.sin(2*g_seconds));
  }
}

function renderShapes() {
  var startTime = performance.now();

  var globalRotMat = new Matrix4().rotate(g_globalAnglex, 0, 1, 0);
  globalRotMat = globalRotMat.rotate(g_globalAngle,1,0,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


 

  var leftEye3 = new Cube();
  leftEye3.color = [0.59, 0.29, 0.0, 1.0];
  leftEye3.matrix.rotate(0,1,0,0);
  leftEye3.matrix.scale(0.10, 0.05, .1);
  leftEye3.matrix.translate(2.0, 13, -1.50);
  leftEye3.render();

  

  var rightEye3 = new Cube();
  rightEye3.color = [0.59, 0.29, 0.0, 1.0];
  rightEye3.matrix.rotate(0,1,0,0);
  rightEye3.matrix.scale(0.10, 0.05, .1);
  rightEye3.matrix.translate(-3, 13, -1.50);
  rightEye3.render();



  var belly = new Cube();
  belly.color = [1.0, 1.0, 1.0, 1.0];
  belly.matrix.rotate(0,1,0,0);
  belly.matrix.scale(0.30, .30, .1);
  belly.matrix.translate(-.50, -.3, -1.50);
  belly.render();



  var nose = new Cube();
  nose.color = [0,0,0, 1.0];
  nose.matrix.rotate(0,1,0,0);
  nose.matrix.scale(0.30, .20, .2);
  nose.matrix.translate(-.50, 2.2, -1.50);
  nose.render();

  var leftEar = new Cube();
  leftEar.color = [0.7, 0.7, 0.7, 1.0];
  leftEar.matrix.rotate(0,1,0,0);
  leftEar.matrix.scale(0.20, .20, .2);
  leftEar.matrix.translate(-2.0, 3.8, .10);
  leftEar.render();

  var rightEar = new Cube();
  rightEar.color = [0.7, 0.7, 0.7, 1.0];
  rightEar.matrix.rotate(0,1,0,0);
  rightEar.matrix.scale(0.20, .20, .2);
  rightEar.matrix.translate(1.0, 3.8, .10);
  rightEar.render();

  var head = new Cube();
  head.color = [.67, .67, .67, 1.0];
  head.matrix.rotate(0,1,0,0);
  head.matrix.scale(.9, .6, .5);
  head.matrix.translate(-.5, 0.5, -.25);
  head.render();

  var body = new Cube();
  body.color = [0.85, 0.85, 0.85, 1.0];
  body.matrix.rotate(0,1,0,0);
  body.matrix.scale(.70, .50, .4);
  body.matrix.translate(-.5, -0.4, -.18);
  body.render();

  var leftArm = new Cube();
  leftArm.color = [.52, .52, .52, 1.0];
  leftArm.matrix.rotate(-g_leftArm,0,0,1);
  leftArm.matrix.scale(0.5, .18, .2);
  leftArm.matrix.translate(.15, .5, .18);
  leftArm.render();

  var rightArm = new Cube();
  rightArm.color = [.52, .52, .52, 1.0];
  rightArm.matrix.rotate(g_rightArm, 0, 0, 1);
  rightArm.matrix.scale(0.5, .18, .2);
  rightArm.matrix.translate(-1.15, .5, .18);
  rightArm.render();
  
  var leftLeg = new Cube();
  leftLeg.color = [0.85, 0.85, 0.85, 1.0];
  leftLeg.matrix.rotate(-g_leftLeg,1,0,0);
  var leftLegCoord = new Matrix4(leftLeg.matrix)
  leftLeg.matrix.scale(0.30, .4, .4);
  leftLeg.matrix.translate(.17, -.8, -.18);
  leftLeg.render();

  var rightLeg = new Cube();
  rightLeg.color = [0.85, 0.85, 0.85, 1.0];
  rightLeg.matrix.rotate(-g_rightLeg, 1, 0, 0);
  var rightLegCoord = new Matrix4(rightLeg.matrix)
  rightLeg.matrix.scale(0.30, .4, .4);
  rightLeg.matrix.translate(-1.17, -.8, -.18);
  rightLeg.render();

  var leftStub = new Cube();
  leftStub.matrix = leftLegCoord;
  leftStub.color = [0.85, 0.85, 0.85, 1.0];
  leftStub.matrix.rotate(-g_leftFeet,1,0,0);
  leftStub.matrix.scale(0.25, .1, .4);
  leftStub.matrix.translate(.30, -4.0, -.18);
  leftStub.render();

  var rightStub = new Cube();
  rightStub.matrix = rightLegCoord;
  rightStub.color = [0.85, 0.85, 0.85, 1.0];
  rightStub.matrix.rotate(-g_rightFeet,1,0,0);
  rightStub.matrix.scale(0.25, .1, .4);
  rightStub.matrix.translate(-1.30, -4.0, -.18);
  rightStub.render();

  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}
