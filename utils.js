// @mtSound
// check if an object is present in an array
// it also performs some rounding so that close matches are also evaluated (within +/- resolution)
function arrContainsObject(obj, arr) {
    for (let i = 0; i < arr.length; i++) {
      if ((arr[i].x >= (obj.x - resolution) && arr[i].x <= (obj.x + resolution)) && (arr[i].y >= (obj.y - resolution) && arr[i].y <= (obj.y + resolution))) {
        collisionArray.push({x: arr[i].x, y: arr[i].y});
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