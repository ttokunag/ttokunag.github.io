/*
 * The following function implements the A* pathfinding
 * algorithm 
 */
function AStar() {
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