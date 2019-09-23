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
let canvas;
let started = false;
let ended = false;
let noSolution = false;
let current;
let startButton;
let startIsDragged = false;
let destIsDragged = false;
let creatingWalls = false;
let resetButton;
let resetAllButton;
let wallCloseSpan;
let pointCloseSpan;
let wallModalClosed = false;
let pointModalClosed = false;
let isSmartPhone = false;

function setup() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) 
    || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {
        isSmartPhone = true;
    } 
    canvas = createCanvas(windowWidth, windowHeight / 1.3);
    canvas.parent('#canvas');
  
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

    /* initial states drawing */
    background(255);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].show();
        }
    }    
    stroke(0); strokeWeight(2); fill(0, 0, 0, 50);
    triangle(
        (startPos[0] * boxSize) + paddingH + boxSize/4.5, (startPos[1] * boxSize) + paddingV + boxSize/6,
        (startPos[0] * boxSize) + paddingH + boxSize/4.5, (startPos[1] * boxSize) + paddingV + 5*boxSize/6,
        (startPos[0] * boxSize) + paddingH + boxSize/1.2, (startPos[1] * boxSize) + paddingV + boxSize/2,
    );
    ellipse((endPos[0] * boxSize) + paddingH + boxSize/2, (endPos[1] * boxSize) + paddingV + boxSize/2, boxSize/1.3);
    ellipse((endPos[0] * boxSize) + paddingH + boxSize/2, (endPos[1] * boxSize) + paddingV + boxSize/2, boxSize/3);
    strokeWeight(1); // revert stroke weight
    noLoop();
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
                noLoop();
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

    if (!noSolution) {
        noFill();
        stroke(color('#FFEF6C'));
        strokeWeight(boxSize / 2.5);
        beginShape();
        for (let i = 0; i < path.length; i++) {
            vertex((path[i].row * boxSize) + (boxSize/2 + paddingH), (path[i].col * boxSize) + (boxSize/2 + paddingV));
        }
        endShape();
        strokeWeight(1);
    } else {
        // stop the loop when no solution
        noLoop();
    }

    /* draws the start and destination icons */
    stroke(0); strokeWeight(2); fill(0, 0, 0, 50);
    triangle(
        (startPos[0] * boxSize) + paddingH + boxSize/4.5, (startPos[1] * boxSize) + paddingV + boxSize/6,
        (startPos[0] * boxSize) + paddingH + boxSize/4.5, (startPos[1] * boxSize) + paddingV + 5*boxSize/6,
        (startPos[0] * boxSize) + paddingH + boxSize/1.2, (startPos[1] * boxSize) + paddingV + boxSize/2,
    );
    ellipse((endPos[0] * boxSize) + paddingH + boxSize/2, (endPos[1] * boxSize) + paddingV + boxSize/2, boxSize/1.3);
    ellipse((endPos[0] * boxSize) + paddingH + boxSize/2, (endPos[1] * boxSize) + paddingV + boxSize/2, boxSize/3);
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
    wallCloseSpan = select('#wall-close');
    wallCloseSpan.mousePressed(wallClosePressed);
    pointCloseSpan = select('#point-close');
    pointCloseSpan.mousePressed(pointClosePressed);

    if (isSmartPhone) {
        for (let modal of selectAll('.modal-content')) {
            modal.removeClass('modal-content');
            modal.class('modal-content-smapho');
        }
    }

    startButton = createButton('Start');
    startButton.mousePressed(startAlgo);
    startButton.class('button');
    startButton.parent('#navbar')

    resetButton = createButton('Reset');
    resetButton.mousePressed(reset);
    resetButton.class('button');
    resetButton.parent('#navbar');

    resetAllButton = createButton('Remove Walls');
    resetAllButton.mousePressed(resetAll);
    resetAllButton.class('button');
    resetAllButton.parent('#navbar');
}
function wallClosePressed() {
    select('#wall-modal').style('display', 'none');
    wallModalClosed = true;
}
function pointClosePressed() {
    select('#point-modal').style('display', 'none');
    pointModalClosed = true;
}
function startAlgo() {
    started = true;
    loop();
}
function reset() {
    openSet = [start];
    closedSet = [];
    path = [];
    started = false; 
    ended = false; 
    noSolution = false;
    // draw a new grid keeping objects
    drawNewGrid();
}
function resetAll() {
    openSet = [start];
    closedSet = [];
    started = false;
    path = [];
    started = false; ended = false; 
    noSolution = false;
    // reset walls
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].wall = false;
        }
    }
    // draw a new grid
    drawNewGrid();
}
function drawNewGrid() {
    /* drawing a new grid */
    background(255);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].show();
        }
    }
    stroke(0); strokeWeight(2); fill(0, 0, 0, 50);
    // starting spot
    triangle(
        (startPos[0] * boxSize) + paddingH + boxSize/4.5, (startPos[1] * boxSize) + paddingV + boxSize/6,
        (startPos[0] * boxSize) + paddingH + boxSize/4.5, (startPos[1] * boxSize) + paddingV + 5*boxSize/6,
        (startPos[0] * boxSize) + paddingH + boxSize/1.2, (startPos[1] * boxSize) + paddingV + boxSize/2,
    );
    // destination spot
    ellipse((endPos[0] * boxSize) + paddingH + boxSize/2, (endPos[1] * boxSize) + paddingV + boxSize/2, boxSize/1.3);
    ellipse((endPos[0] * boxSize) + paddingH + boxSize/2, (endPos[1] * boxSize) + paddingV + boxSize/2, boxSize/3);
    strokeWeight(1);
}
function mousePressed() {
    /* diables building walls when modals are opened
        or algorithms started */
    if (!(wallModalClosed && pointModalClosed) || started || ended) {
        return;
    }
        
    let xPressed = floor((mouseX-paddingH) / boxSize);
    let yPressed = floor((mouseY-paddingV) / boxSize);
    /* avoid the case of out-of-bounds */
    if (!((xPressed >= 0 && xPressed < grid.length) && (yPressed >= 0 && yPressed < grid[0].length))) {
        return;
    }
    /* when empty blocks are pressed */
    if (!((xPressed == startPos[0] && yPressed == startPos[1]) 
            || (xPressed == endPos[0] && yPressed == endPos[1]))) {
        grid[xPressed][yPressed].wall = !grid[xPressed][yPressed].wall;
        // drawing a block
        stroke(0, 0, 0, 55);
        if (grid[xPressed][yPressed].wall) {
            fill(71);
        } else {
            fill(255);
        }
        rect((xPressed * boxSize) + paddingH, (yPressed * boxSize) + paddingV, boxSize, boxSize);
    }
}
function mouseDragged() {
    /* diables building walls when modals are opened
        or algorithms started */
    if (!(wallModalClosed && pointModalClosed) || started || ended) {
        return;
    }

    let xPressed = floor((mouseX-paddingH) / boxSize);
    let yPressed = floor((mouseY-paddingV) / boxSize);

    /* 3 options: empty, start and destination */
    if (!(startIsDragged || destIsDragged || creatingWalls)) {
        if (xPressed == startPos[0] && yPressed == startPos[1]) {
            startIsDragged = true;
        } else if (xPressed == endPos[0] && yPressed == endPos[1]) {
            destIsDragged = true;
        } else {
            creatingWalls = true;
        }
    }

    /* avoid the out-of-bounds error */
    if (!((xPressed >= 0 && xPressed < grid.length) && (yPressed >= 0 && yPressed < grid[0].length))) {
        return;
    }

    /* the case either the start or the destination is dragged */
    if ((startIsDragged || destIsDragged) && !grid[xPressed][yPressed].wall) {
        if (startIsDragged) {
            startPos = [xPressed, yPressed];
            start = grid[xPressed][yPressed];
            openSet = [start];
        } else {
            endPos = [xPressed, yPressed]
            end = grid[xPressed][yPressed];
        }

        drawNewGrid();
    } 
    else { // creating walls
        // avoid crating walls on the start & destination spots
        if (!((xPressed == startPos[0] && yPressed == startPos[1])
            || (xPressed == endPos[0] && yPressed == endPos[1])))
        {
            grid[xPressed][yPressed].wall = true;
            stroke(0, 0, 0, 55);
            fill(71);
            rect((xPressed * boxSize) + paddingH, (yPressed * boxSize) + paddingV, boxSize, boxSize);
        }
    }
}
function mouseReleased() {
    // reset the dragging status
    startIsDragged = false;
    destIsDragged = false;
    creatingWalls = false;
}