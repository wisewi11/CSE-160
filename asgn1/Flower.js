class Flower{
   constructor(){
      this.type='flower';
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
      this.sCount = 6.5;
      this.outline = 0;
   }

   render() {
      var xy = this.position;
      var rgba = this.color;
      var size = 11-Math.round(this.size);

      
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      var beta = Math.PI/2;
      var count = 0; 
      var counter = 0; 
      var base = new Float32Array(10);
      var n = 0;

      
      for(var circle = 0; circle <= (2*Math.PI); circle += beta){
         base[count] = (xy[0]+(1/(2*size))*Math.cos(n*beta));
         count++;
         base[count] = (xy[1]+(1/(2*size))*Math.sin(n*beta));
         count++;
         n++;
      }

      
      while(counter < base.length){
         var x = base[counter++];
         var y = base[counter++];
         drawCircle(x,y, this.outline, this.sCount, size);
      }
   }
}
