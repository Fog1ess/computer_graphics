
function flatten(a) {
    if(a.length && !a[0].length) {//a is a vector
      let result = new Float32Array(a.length);
      for(let i = 0; i < a.length; i++) 
        result[i] = a[i];
      return result;
    }
    
    if(a.length && a[0].length) {//a is a matrix
      let result = new Float32Array(a.length * a[0].length);
      for(let i = 0; i < a.length; i++) {
        for(let j = 0; j < a[0].length; j++) {
          result[i*a[0].length + j] = a[i][j];
        }
      }
      return result;
    }
}
  