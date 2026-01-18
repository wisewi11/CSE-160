class Circle{
   constructor(){
      this.type='circle';
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
      this.sCount = 12;
      
   }

   render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;

      
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      
      var delta = size/40.0;
      var angleStep = 360/this.sCount*.5;

      
      
         for(var angle = 0; angle <= 360; angle += angleStep){
            let centerPt = [xy[0], xy[1]];
            let angle1 = angle;
            let angle2 = angle + angleStep;
            let vec1 = [Math.cos(angle1*Math.PI/180)*delta, Math.sin(angle1*Math.PI/180)*delta];
            let vec2 = [Math.cos(angle2*Math.PI/180)*delta, Math.sin(angle2*Math.PI/180)*delta];
            let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
            let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];

            drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]], this.outline);
         }

      
     
   }
}

function drawCircle(x,y, outline, sCount, size){
   var theta = Math.PI/sCount;
   var count = 0; 
   var n = 0; 
   var vertices = new Float32Array(48);

   for(var circle = 0; circle <= (2*Math.PI); circle += theta){
      vertices[count] = (x+(1/(1.5*size))*Math.cos(n*theta));
      count++;
      vertices[count] = (y+(1/(1.5*size))*Math.sin(n*theta));
      count++;
      n++;
   }
   n--;

   
   var vertexBuffer = gl.createBuffer();
   if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
   }

   
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);


   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  
   gl.enableVertexAttribArray(a_Position);

   if (outline == 1){
      gl.drawArrays(gl.LINE_LOOP, 0, n);
   } else if (outline == 0) {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
   }
}
