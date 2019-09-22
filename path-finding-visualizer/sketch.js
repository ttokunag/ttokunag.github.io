// algorithm variables
let rows, cols;
let rowSet = [-1,-1,-1,0,0,1,1,1];
let colSet = [-1,0,1,-1,1,-1,0,1];
let grid = new Array(rows);
let openSet = [];
let closedSet = [];
let start, end; // Start and end
let startPos, endPos;
let boxSize = 29; // the size of each box
let paddingV, paddingH;
let path = []; // The road taken
// visualizer variables
let started = false;
let ended = false;
let noSolution = false;
let current;
let startButton;
let startIsDragged = false;
let destIsDragged = false;
let resetButton;
let resetAllButton;
  
function setup() {
    createCanvas(windowWidth, windowHeight / 1.3);
    console.log('A*');
  
    // Grid cell size
    rows = floor(width / boxSize);
    cols = floor(height / boxSize);
    paddingH = (width - (rows * boxSize)) / 2;
    paddingV = (height - (cols * boxSize)) / 2;
  
    // Making a 2D array
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
    }
  
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }
  
    // All the adjacents
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].addAdjacents(grid);
        }
    }
  
    // Start and end
    startPos = [floor(grid.length/4), floor(grid[0].length/2)];
    endPos = [floor(3*grid.length/4), floor(grid[0].length/2)];
    start = grid[startPos[0]][startPos[1]];
    end = grid[endPos[0]][endPos[1]];
    start.wall = false;
    end.wall = false;
  
    // openSet starts with beginning only
    openSet.push(start);

    objectInit();
}
  
function draw() {
    if (started && !ended) {
        /* continue searching until all visitable nodes get visited */
        if (openSet.length > 0) {
            // find best next option
            let winner = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[winner].f) {
                    winner = i; // Heap could do better
                }
            }
            current = openSet[winner];

            /* when reached the destination */
            if (current === end) {
                started = false; // stops the algorithm
                ended = true;
                console.log("DONE!");
            }

            // Best option moves from openSet to closedSet
            removeFromArray(openSet, current);
            closedSet.push(current);

            // Check all the adjacents
            let adjacents = current.adjacents;
            for (let i = 0; i < adjacents.length; i++) {
                let neighbor = adjacents[i];

                // Valid next spot?
                if (!closedSet.includes(neighbor) && !neighbor.wall) {
                    // calculates the actual distance
                    let tempG = current.g + heuristic(neighbor, current);
            
                    // Is this a better path than before?
                    let newPath = false;
                    if (openSet.includes(neighbor)) {
                        if (tempG < neighbor.g) {
                            neighbor.g = tempG;
                            newPath = true;
                        }
                    } else {
                        neighbor.g = tempG;
                        newPath = true;
                        openSet.push(neighbor);
                    }
            
                    // Yes, it's a better path
                    if (newPath) {
                        neighbor.h = heuristic(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                    }
                }
            }
        } else { // Uh oh, no solution
            console.log('no solution');
            started = false;
            ended = true;
            noSolution = true;
            return;
        }
    }
  
    /* below draws current state of everything */
    background(255);
  
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].show();
        }
    }
  
    // Find the path by working backwards
    if (openSet.length != 1) {
        let temp = current;
        path = [];
        path.push(temp);
        while (temp.previous) {
            path.push(temp.previous);
            temp = temp.previous;
        }
    }

    for (let i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color('#B455A0'));
    }
    for (let i = 0; i < openSet.length; i++) {
        if (openSet.length != 1)
            openSet[i].show(color('#D2A3CB'));
    }
  
  
    // for (let i = 0; i < path.length; i++) {
    //     path[i].show(color('#FFEF6C'));
    // }

    if (!noSolution) {
        noFill();
        stroke(color('#FFEF6C'));
        strokeWeight(boxSize / 2);
        beginShape();
        for (let i = 0; i < path.length; i++) {
            vertex((path[i].row * boxSize) + (boxSize/2 + paddingH), (path[i].col * boxSize) + (boxSize/2 + paddingV));
        }
        endShape();
        strokeWeight(1);
    }

    /* draws the start and destination icons */
    stroke(0); strokeWeight(1.75); fill(0, alpha=50);
    triangle(
        (startPos[0] * boxSize) + paddingH + boxSize/4, (startPos[1] * boxSize) + paddingV + boxSize/6,
        (startPos[0] * boxSize) + paddingH + boxSize/4, (startPos[1] * boxSize) + paddingV + 5*boxSize/6,
        (startPos[0] * boxSize) + paddingH + boxSize/1.2, (startPos[1] * boxSize) + paddingV + boxSize/2,
    );
    ellipse((endPos[0] * boxSize) + paddingH + boxSize/2, (endPos[1] * boxSize) + paddingV + boxSize/2, boxSize/1.3);
    ellipse((endPos[0] * boxSize) + paddingH + boxSize/2, (endPos[1] * boxSize) + paddingV + boxSize/2, boxSize/2.4);
    strokeWeight(1); // revert stroke weight
}

// Function to delete element from the array
function removeFromArray(arr, target) {
    // Could use indexOf here instead to be more efficient
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == target) {
        arr.splice(i, 1);
        }
    }
}
  
// An educated guess of how far it is between two points
function heuristic(a, b) {
    return dist(a.row, a.col, b.row, b.col);;
}

/* functions for visualizer below */
function objectInit() {
    startButton = createButton('Start');
    startButton.mousePressed(startAlgo);
    resetButton = createButton('Reset');
    resetButton.mousePressed(reset);
    resetAllButton = createButton('Reset All');
    resetAllButton.mousePressed(resetAll);
}
function startAlgo() {
    started = true;
}
function reset() {
    openSet = [start];
    closedSet = [];
    started = false;
    path = [];
    started = false; ended = false; 
    noSolution = false;
}
function resetAll() {
    openSet = [start];
    closedSet = [];
    started = false;
    path = [];
    started = false; ended = false; 
    noSolution = false;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].wall = false;
        }
    }
}
function mousePressed() {
    if (started || ended)
        return;
        
    let xPressed = floor((mouseX-paddingH) / boxSize);
    let yPressed = floor((mouseY-paddingV) / boxSize);
    if (!((xPressed >= 0 && xPressed < grid.length) && (yPressed >= 0 && yPressed < grid[0].length))) {
        return;
    }
    if (!((xPressed == startPos[0] && yPressed == startPos[1]) 
            || (xPressed == endPos[0] && yPressed == endPos[1]))) {
        grid[xPressed][yPressed].wall = !grid[xPressed][yPressed].wall;
    }
}
function mouseDragged() {
    if (started || ended)
        return;

    let xPressed = floor((mouseX-paddingH) / boxSize);
    let yPressed = floor((mouseY-paddingV) / boxSize);
    if (xPressed == startPos[0] && yPressed == startPos[1]) {
        startIsDragged = true;
    } else if (xPressed == endPos[0] && yPressed == endPos[1]) {
        destIsDragged = true;
    }

    if (!((xPressed >= 0 && xPressed < grid.length) && (yPressed >= 0 && yPressed < grid[0].length))) {
        return;
    }

    if (startIsDragged) {
        startPos = [xPressed, yPressed]
        start = grid[xPressed][yPressed];
        openSet = [start];
    } else if (destIsDragged) {
        endPos = [xPressed, yPressed]
        end = grid[xPressed][yPressed];
    } else {
        grid[xPressed][yPressed].wall = true;
    }
}
function mouseReleased() {
    startIsDragged = false;
    destIsDragged = false;
}
