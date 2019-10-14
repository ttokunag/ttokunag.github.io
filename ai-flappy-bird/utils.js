function drawOnCanvas() {
    /* shows the pipes */
    for (let pipe of pipes) {
        pipe.show();
    }

    /* shows the game mode */
    fill(255); noStroke();
    textSize(15); textAlign(LEFT); textStyle(BOLD);
    if (playMode) {
        text('Player Mode', width/35, height/18);
    } else {
        if (!aiLoadedMode) {
            text('AI Mode', width/35, height/18);
        } else {
            text('AI Mode (LOADED)', width/35, height/18);
        }
    }
    /* displays game scores */
    stroke(0); strokeWeight(4);
    textSize(28); textAlign(CENTER);
    text(currentGameScore, width / 2.05, height / 7);
}

function drawAIIntro() {
    stroke(0); strokeWeight(3);
    textSize(24); textAlign(CENTER);
    text('Press "Start AI"', width / 2.05, height/7 + 50);
}
function drawPlayIntro() {
    stroke(0); strokeWeight(3);
    textSize(20); textAlign(CENTER);
    text('SPACE or TAP to fly', width / 2.05, height/7 + 50);
}
function gameOverPhase(bird) {
    bird.update();
    background(60, 60, 60, 150);
    textSize(32); strokeWeight(1);
    text('GAME OVER', width/2, height/2);
    textSize(15); textStyle(NORMAL);
    text('Hit ENTER to restart', width/2, height/2 + 30);
}

function counterUtil() {
    // every 75 drawings add a new pipe
    if (counter % 75 == 0) {
        pipes.push(new Pipe());
        // closest pipe is needed to let a bird think
        if (!playMode && closest == null) {
          closest = pipes[0];
        }
    }
    counter++;
    currentGameScore = floor(counter / 75);
}

function regenerateBirds() {
    // if all birds hit pipes, starts the next learning phase
    if (birds.length === 0) {
        counter = 0;
        currentGameScore = 0;
        nextGeneration();
        pipes = [];
    }
}

function analysisTriangles() {
    /* draw triangles (KEEP THIS POSITION)*/
    if (analysisMode) {
        if (!aiLoadedMode) {
            for (let i = 0; i < birds.length; i++) {
                if (birds[i].x < closest.x) {
                    if (birds[i].velocity < 0) {
                        stroke(255, 0, 0, 50); fill(255, 0, 0, 50);
                    } else {
                        stroke(0, 0, 255, 50); fill(0, 0, 255, 50);
                    }
                    triangle(
                        birds[i].x, birds[i].y, 
                        closest.x + closest.w/2, closest.top, 
                        closest.x + closest.w/2, height - closest.bottom
                    );
                }
            }
        } else {
            if (loadedBird.x < closest.x) {
                if (loadedBird.velocity < 0) {
                    stroke(255, 0, 0, 50); fill(255, 0, 0, 50);
                } else {
                    stroke(0, 0, 255, 50); fill(0, 0, 255, 50);
                }
                triangle(
                    loadedBird.x, loadedBird.y, 
                    closest.x + closest.w/2, closest.top, 
                    closest.x + closest.w/2, height - closest.bottom
                );
            }
        }
    }
}
function fakeDelay () {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve()}, 500);
    });
}