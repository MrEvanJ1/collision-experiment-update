// @mtSound
const resolution = 3;

//Get master div element and dimensions
const masterDiv = document.getElementById("masterDiv");
//set the master div which contains all page elements to the full innerwidth and innerheight of window
masterDiv.setAttribute("style", `width:${window.innerWidth}px`);
masterDiv.setAttribute("style", `height:${window.innerHeight}px`);
//retreive the dimensions of the master div for child Divs to refer to
const mstrBbox = masterDiv.getBoundingClientRect();

//Get button div element and dimensions
const buttonDiv = document.getElementById("button-div1");
//sets the button Div element to one eighth the height of the master Div
buttonDiv.setAttribute("style", `width:${mstrBbox.width}px`);
buttonDiv.setAttribute("style", `height:${mstrBbox.height/12}px`);
//retreive the dimensions of the button div for reference
const btnBbox = buttonDiv.getBoundingClientRect();

// Get the canvas element
const canvas = document.getElementById("collisionCanvas");
const ctx = canvas.getContext("2d");
const ctx2 = canvas.getContext("2d");
const cnvDiv = document.getElementById("canvasDiv");

//set the canvas Div element to occupy the full available space remaining from the button Div
cnvDiv.setAttribute("style", `width:${mstrBbox.width}px`);
cnvDiv.setAttribute("style", `height:${mstrBbox.height - btnBbox.height}px`);

const cnvBbox = cnvDiv.getBoundingClientRect();

//set initial canvas size
canvas.setAttribute("width", cnvBbox.width);
canvas.setAttribute("height", cnvBbox.height);

// Get button 1
const button1 = document.getElementById("button1");

//coordinates for clearing using clearRect() method
let clearX;
let clearY;
let clearWidth;
let clearHeight;

//randomly defines a rectangular areas of the canvas to be cleared
function clearRandomQuadrant(){
  clearX = canvas.width*random();
  clearY = canvas.height*random();
  clearWidth = Math.round(random(canvas.width));
  clearHeight = Math.round(random(canvas.height));

  ctx.clearRect(clearX, clearY, clearWidth, clearHeight);
  console.log("rect cleared");

  //removes from the lines array stored coordinates matching the cleared area 
  rectClearArraySweep()

  console.log(`lines array just shrank to ${lines.length}` )

}
/*assigns button 1 the function of clearing randomly defined rectangular areas of the canvas using the
clearRandomQuadrant() function*/
button1.addEventListener("click", (e) => {
  clearRandomQuadrant();
})

//function to check through lines array and remove any indices matching the most recently cleared rectangle
function rectClearArraySweep(){
  for( let i=lines.length-1; i>0; i--){

    if (
      lines[i].x >= clearX &&
      lines[i].x <= clearX + clearWidth &&
      lines[i].y >= clearY &&
      lines[i].y <= clearY+ clearHeight
    ){
      //removes from the array any instance which passed the above conditions
      lines.splice(i,1);
      console.log("splicing occurred")
    }
  }
}

// Create an array to hold the lines
let lines = [];

// @mtSound
// logs (x,y) coordinates for collision instances
// not sure if need this
let collisionArray = [];

// Initialize mouse position variables
let mouseX;
let mouseY;

// Function to handle mouse movement
function handleMouseMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

// Function to generate random colors
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Line class
class Line {
  // @mtSound
  /* amended the constructor to take: 
  - the 'lineWidth' (so it scales down each generation) 
  - the parent line (so the line doesn't collide with it's parent)
  - the 'depth', which is incremented each time a child is drawn - this stops infinite recursion
  */
  constructor(x, y, color, lineWidth, parent, depth) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = Math.random() * 2 - 1; // Random velocity for x-axis (-1 to 1)
    this.vy = Math.random() * 2 - 1; // Random velocity for y-axis (-1 to 1)
    this.length = Math.random() * 1 + 50; // Random length of the line (50 to 150)
    this.lineWidth = lineWidth ?? Math.random() * 3 + 1; // Random line width (1 to 4)
    this.prevX = x; // Previous x position
    this.prevY = y; // Previous y position

    // @mtSound
    // added these parameters for collision purposes
    this.xyArr = []; // initialise an empty xyArr to store the line coordinates every time it calls the update method
    this.parent = parent; // need to pass the parent line in, otherwise an immediate collision is logged
    this.depth = depth ?? 0; // depth of the 'family tree' - stops infinite recursion
  }

  update() {
    this.prevX = this.x;
    this.prevY = this.y;
    this.x += this.vx;
    this.y += this.vy;

    // Check for collision with the canvas borders
    if (this.x < 0 || this.x > canvas.width) {
      this.vx *= -1;
    }
    if (this.y < 0 || this.y > canvas.height) {
      this.vy *= -1;
    }

    // @mtSound
    // create an object with the (x,y) coordinates every time the line is updated
    this.xy = {
      x: this.x,
      y: this.y
    };
    // @mtSound
    // push this object into the current line's 'xyArr'
    this.xyArr.push(this.xy);

    // @mtSound
    /* amended this to check for collisions. 
    Also added a condition to stop collisions being logged for the parent line - if you don't do this the child
    immediately collides with the parent (because the start coordinates of the child is the same as one of the parent coordinates) */
    // Check for collision with other lines & stop
    lines.forEach((line) => {
      if (line !== this.parent) {
        if (line !== this) {
          if (arrContainsObject(this.xy, line.xyArr)) {
            //console.log("collision!");
            this.collision = true;
            this.createChild();
          }
        }
      }
    });

    // Check for interaction with mouse position
    const dxMouse = mouseX - this.x;
    const dyMouse = mouseY - this.y;
    const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
    if (distanceMouse < this.length) {
      const angleMouse = Math.atan2(dyMouse, dxMouse);
      const targetXMouse = this.x + Math.cos(angleMouse) * this.length;
      const targetYMouse = this.y + Math.sin(angleMouse) * this.length;
      const axMouse = (targetXMouse - mouseX) * 0.02;
      const ayMouse = (targetYMouse - mouseY) * 0.02;
      this.vx -= axMouse;
      this.vy -= ayMouse;

    }

  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.prevX, this.prevY);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.stroke();
  }

  // @mtSound
  // added this function to create a child line.
  createChild() {
    // pick a random point along the parent line
    //let xyRand = this.xyArr[Math.floor(Math.random() * this.xyArr.length)];
    // get the xy position halfway along the length of the line
    let childxy = this.xyArr[Math.round((this.xyArr.length - 1) / 2)];

    // stops infinite recursion
    if (this.depth < 5) {
      lines.push(new Line(childxy.x, childxy.y, "lightgreen", this.lineWidth * 0.5, this, this.depth + 1))
    }
  }
}

// @mtSound
// Initialize the lines on mouse click
function initialize(e) {
  //start coordinates
  let mouseX = parseInt(e.clientX);
  let mouseY = parseInt(e.clientY);
  //conditional check ensures that mouse clicks in the button Div area will not register as initialisations of new lines
  if(mouseY>btnBbox.height){
    const color = "lightgreen";
    //"- btnBbox.height" added to correct for an offset that was occuring related to the responsive scaling of the Canvas
    lines.push(new Line(mouseX, mouseY - btnBbox.height, color));
  }
}

// @mtSound
// Turn this back on if you want to start the lines randomly
function initialize(e) {
  let mouseX = parseInt(e.clientX);
  let mouseY = parseInt(e.clientY);
  //conditional check ensures that mouse clicks in the button Div area will not register as initialisations of new lines
  if(mouseY>btnBbox.height){
    for (let i = 0; i < 10; i++) {
      //start coordinates
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;

      const color = "lightgreen";
      lines.push(new Line(x, y, color));
    }
  }
}

//used by the drawline function in Utils
let x1;
let y1;
let x2;
let y2;

//variable to increment in the update() function for progressively shifting colour hues
let hueRotate = 0;
// Update function
function update() {
  // @MrEvanJ1
  /*added a hue rotate filter that ticks over slowly altering the colour palette of the image and eventually have the effect to remove longstanding trails
    also has a slight blur for a halo effect and some interesting crossover colours in the trails. GPU use gets uncomfortably high with more than this amount of blur
    or with too many initialised lines*/
  ctx.filter = `hue-rotate(${hueRotate}deg) blur(1px)`
  // @MrEvanJ1
  //adds a full page canvas rect with dull red at very low opacity that adds that tint and is what allows the trails to build up by drawing over every update
  ctx.fillStyle = 'rgba(50, 20, 20, .01)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  lines.forEach((line) => {
    // @mtSound
    // added condition for collision
    if (!line.collision) {
      line.update();
      line.draw();
    }
  });
  //enbales shift of hue for multicolour effects
  hueRotate++;
  requestAnimationFrame(update);
}


// Event listeners
window.addEventListener("mousemove", handleMouseMove);

// Initialize and start the animation
update();


// event listener for clicking anywhere on the page
document.addEventListener('click', initialize);
