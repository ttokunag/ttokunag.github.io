let values = [];
let w = 20;

let slow = 0;
let fast = slow + 1;
let minIndex = slow;
let states = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  values = new Array(floor(width / w));
  for (let i = 0; i < values.length; i++) {
    //values[i] = random(height);
    values[i] = (height/w)*(i*(w/values.length));
    if (i == minIndex) {
      states[i] = 2;
    } else {
      states[i] = 0;
    }
  }
}

export function swap(array, i, j) {
  let temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

function draw() {
  // change the state of the fast
  if (slow < values.length - 1) {
      if (fast > slow) {
        states[fast] = 3;
        if (fast - 1 != minIndex) {
          states[fast - 1] = 0;
        }
      }
    // fast reached the end
    if (fast == values.length) {
      states[minIndex] = 0;
      swap(values, minIndex, slow);
      states[slow] = 1;

      slow++;
      minIndex = slow;
      states[minIndex] = 2;
      fast = slow + 1;
    } else {
      if (values[fast] < values[minIndex]) {
        states[minIndex] = 0;
        minIndex = fast;
        states[minIndex] = 2;
      }
      fast++;
    }
  } else {
    states[minIndex] = 1;
    console.log("finished");
    noLoop();
  }

  background(51);
  for (let i = 0; i < values.length; i++) {
    if (states[i] == 0) {
      fill(255);
    } else if (states[i] == 1) {
      fill(230, 220, 250);
    } else if (states[i] == 2) {
      fill(0, 0, 170);
    } else {
      fill(135, 206, 250);
    }
    stroke(0);
    rect(i * w, height - values[i], w, values[i]);
  }
}