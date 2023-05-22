// @mtSound
// check if an object is present in an array
// it also performs some rounding so that close matches are also evaluated (within +/- resolution)
function arrContainsObject(obj, arr) {
    for (let i = 0; i < arr.length; i++) {
      if ((arr[i].x >= (obj.x - resolution) && arr[i].x <= (obj.x + resolution)) && (arr[i].y >= (obj.y - resolution) && arr[i].y <= (obj.y + resolution))) {
        collisionArray.push({x: arr[i].x, y: arr[i].y});
        //once the array has multiple entries, draws a line from the first collision point to the most recent
        if(collisionArray.length>=2){
          x1 = collisionArray[0].x;
          y1 = collisionArray[0].y;
          x2 = collisionArray[collisionArray.length-1].x;
          y2 = collisionArray[collisionArray.length-1].y;
          drawLine(x1,y1,x2,y2);
        }
        return true;
      }
    }
    return false;
  }

//this random function is overloaded:
//random will return a value between 0 and 1 (not including 1)
//random (upper) will return a value between 0 and upper (not including upper)
//random (lower, upper) will return a value between lower and upper (not including upper) 
function random() {
  switch(arguments.length) {
      case 0:
          return Math.random();
          break;
      case 1:
          return Math.random() * arguments[0];
          break;
      case 2:
          return arguments[0] + Math.random()*(arguments[1] - arguments[0]);
          break;
      default:
          console.log("too many arguments passed to random()");
          break;
  }
}

//simple Canvas line-drawing function
function drawLine(x1,y1,x2,y2) {
  ctx2.beginPath();
  ctx2.moveTo(x1, y1);
  ctx2.lineTo(x2, y2);
  ctx2.strokeStyle = "rgba(255,255,255,1)"
  ctx2.lineWidth = 0.2;
  ctx2.stroke(); 
}