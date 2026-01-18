const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const FLOWER = 3;

var gl;
var canvas;
var a_Position;
var u_FragColor;
var u_Size;

var g_shapesList = [];

var g_selectedColor = [0.5, 0.5, 0.5, 1.0];
var g_selectedSize = 5;
var g_selectedType = POINT;
var g_selectedsCount = 12;
const g_outline = 0;
var drag = false;
var g_showPicture = false;

var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform float u_Size;\n' +
    'void main() {\n' +
    ' gl_Position = a_Position;\n' +
    ' gl_PointSize = u_Size;\n' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';

function addActionsForHtmlUI(){
   document.getElementById('clear').onclick     = function() { g_shapesList = []; renderAllShapes(); };
   document.getElementById('picture').onclick   = function() {
      g_showPicture = !g_showPicture;
      this.innerHTML = g_showPicture ? 'Hide Picture' : 'Show Picture';
      renderAllShapes();
   };
   document.getElementById('square').onclick    = function() { g_selectedType = POINT; };
   document.getElementById('triangle').onclick  = function() { g_selectedType = TRIANGLE; };
   document.getElementById('circle').onclick    = function() { g_selectedType = CIRCLE; };

   document.getElementById('red').addEventListener('mouseup',     function() { g_selectedColor[0] = this.value*0.1; });
   document.getElementById('green').addEventListener('mouseup',   function() { g_selectedColor[1] = this.value*0.1; });
   document.getElementById('blue').addEventListener('mouseup',    function() { g_selectedColor[2] = this.value*0.1; });

   document.getElementById('size').addEventListener('mouseup',    function() { g_selectedSize = this.value });
   document.getElementById('sCount').addEventListener('mouseup',  function() { g_selectedsCount = this.value; });
}

function setupWebGL(){
   canvas = document.getElementById('asg1');
   if (!canvas) return;

   gl = getWebGLContext(canvas);
   if(!gl) return;
}

function connectVariablesToGLSL(){
   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

   a_Position = gl.getAttribLocation(gl.program, 'a_Position');
   if (a_Position < 0) return;

   u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
   if (!u_FragColor) return;

   u_Size = gl.getUniformLocation(gl.program, 'u_Size');
   if (!u_Size) return;
}

function main() {
   setupWebGL();
   connectVariablesToGLSL();
   addActionsForHtmlUI();

   canvas.onmousedown = function(ev){
      click(ev);
      drag = true;
   };
   canvas.onmouseup = function(){
      drag = false;
   };
   canvas.onmousemove = function(ev){
      if(drag) click(ev);
   };

   gl.clearColor(0.0, 0.0, 0.0, 1.0);
   gl.clear(gl.COLOR_BUFFER_BIT);
}

function convertCoordinatesEventToGL(ev){
   var x = ev.clientX;
   var y = ev.clientY;
   var rect = ev.target.getBoundingClientRect();

   x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
   y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

   return [x,y];
}

function click(ev) {
   var [x,y] = convertCoordinatesEventToGL(ev);
   var point;

   if(g_selectedType==POINT){
      point = new Point();
   } else if (g_selectedType==TRIANGLE){
      point = new Triangle();
   } else if (g_selectedType==CIRCLE){
      point = new Circle();
      point.sCount = g_selectedsCount;
   } else if (g_selectedType==FLOWER){
      point = new Flower();
   }

   point.position = [x,y];
   point.color = [
      Math.min(1, g_selectedColor[0] + (Math.random()-0.5)*0.05),
      Math.min(1, g_selectedColor[1] + (Math.random()-0.5)*0.05),
      Math.min(1, g_selectedColor[2] + (Math.random()-0.5)*0.05),
      1.0
   ];
   point.size = g_selectedSize;
   point.outline = g_outline;

   g_shapesList.push(point);
   renderAllShapes();
}

function renderAllShapes(){
   gl.clear(gl.COLOR_BUFFER_BIT);

   for (var i = 0; i < g_shapesList.length; i++) {
      g_shapesList[i].render();
   }

   
   if (g_showPicture) {
      drawPicture();
   }
}




function pxToClip(px, py) {
   var x = (px - canvas.width / 2) / (canvas.width / 2);
   var y = (canvas.height / 2 - py) / (canvas.height / 2);
   return [x, y];
}

function drawTriPx(x1, y1, x2, y2, x3, y3) {
   var p1 = pxToClip(x1, y1);
   var p2 = pxToClip(x2, y2);
   var p3 = pxToClip(x3, y3);
   drawTriangle([p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]], 0);
}

function setColor(r, g, b, a) {
   gl.uniform4f(u_FragColor, r, g, b, a);
}


function drawPicture() {
  
   setColor(0.47, 0.31, 0.16, 1.0); 
   drawTriPx(190, 300, 210, 300, 190, 220);
   drawTriPx(210, 300, 210, 220, 190, 220);

   setColor(0.16, 0.63, 0.24, 1.0); 
   drawTriPx(130, 240, 270, 240, 200, 170);
   drawTriPx(145, 200, 255, 200, 200, 135);
   drawTriPx(160, 160, 240, 160, 200, 105);

  
   setColor(0.47, 0.31, 0.16, 1.0);
   drawTriPx(90, 310, 105, 310, 90, 260);
   drawTriPx(105, 310, 105, 260, 90, 260);

   setColor(0.16, 0.63, 0.24, 1.0);
   drawTriPx(50, 270, 145, 270, 97, 220);
   drawTriPx(60, 240, 135, 240, 97, 195);
   drawTriPx(70, 210, 125, 210, 97, 170);

  
   setColor(0.47, 0.31, 0.16, 1.0);
   drawTriPx(290, 300, 310, 300, 290, 210);
   drawTriPx(310, 300, 310, 210, 290, 210);

   setColor(0.16, 0.63, 0.24, 1.0);
   drawTriPx(250, 240, 350, 240, 300, 160);
   drawTriPx(260, 205, 340, 205, 300, 130);
   drawTriPx(270, 170, 330, 170, 300, 105);

  
   setColor(1.0, 1.0, 1.0, 1.0);
function drawRectPx(x, y, w, h) {
  
  drawTriPx(x,     y,     x + w, y,     x,     y + h);
  drawTriPx(x + w, y,     x + w, y + h, x,     y + h);
}

  
let wx = 305, wy = 320;
let h = 50;
let bar = 8;

drawRectPx(wx, wy, bar, h);
drawRectPx(wx + 40, wy, bar, h);

drawTriPx(wx + bar, wy + h - 2, wx + 20, wy + 20, wx + 20, wy + h - 2);
drawTriPx(wx + 20,  wy + h - 2, wx + 20, wy + 20, wx + 40, wy + h - 2);


let zx = 355, zy = 320;
let zw = 45, zh = 50;
let t = 8;

drawRectPx(zx, zy, zw, t);
drawRectPx(zx, zy + zh - t, zw, t);

drawTriPx(zx + zw, zy + t, zx + zw - t, zy + t, zx + t, zy + zh - t);
drawTriPx(zx + zw, zy + t, zx + t,      zy + zh - t, zx, zy + zh - t);


}
