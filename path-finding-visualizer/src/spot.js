/* This class represents a location in a grid
* @param row: index of row
* @paran col: index of column
*/
class Spot {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.wall = false;
        // if (random(1) < 0.25) {
        //     this.wall = true;
        // }

        /* 
        * A* uses a function represented as f(x) = g(x) + h(x) 
        * f(x): the total cost to reach x from the start
        * g(x): the actual cost to reach x (ex. Manhattan distance)
        * h(x): the heuristic cost to reach x (ex. Euclidean distance)
        */
        this.f = 0;
        this.g = 0;
        this.h = 0;

        this.adjacents = [];
        this.previous = undefined;
    }
  
    /* 
    * displays this spot on the canvas 
    * @param col: a color object for paint this spot
    */
    show(col) {
        stroke(0, 0, 0, 55);
        if (col) { // spots being processed
            fill(col);
        } else if (this.wall) { // wall
            fill(71);
        } else { // empty spot
            fill(255);
        }
        rect((this.row * boxSize) + paddingH, (this.col * boxSize) + paddingV, boxSize, boxSize);
    }
  
    /* 
    * checks all 8 directions & push valid ones to adjacents
    * @param grid: a grid we're focusing on
    */
    addAdjacents(grid) {
        for (let i = 0; i < rowSet.length; i++) {
            if (this.safeToMove(this.row + rowSet[i], this.col+colSet[i], grid)) {
                this.adjacents.push(grid[this.row + rowSet[i]][this.col+colSet[i]]);
            }
        }
    }

    /*
    * Checks if a give position is safe to visit
    * @param row: a row index
    * @param col: a column index
    * @param grid: a grid we're focusing on
    */
    safeToMove(row, col, grid) {
        return (row >= 0 && row < grid.length) && (col >= 0 && col < grid[0].length);
    }
}