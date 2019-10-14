/*
* This flappy_bird.js file contains all codes related to the
* gaming User Interface.
*/

/* game functionalities are below */
const TOTAL = 500; // the number of samples
let w = 45; let h = Math.floor(w * 0.7036);
let playerBird;
let loadedBird;
let birds = [];
let savedBirds = []; // arrays to store hit bird neurons
let pipes = [];
let closest;
let nnCanvas;
let playMode = false;
let aiLoadedMode = false;
let playerPaused = true; //pre-playing OR game-over
let gameIsOver = false;
let loopPaused = true;
let analysisMode = true;
/* images are below */
let birdImg;
let pipeImg; let pipeTopImg;
let bgImg;
/* dynamic html elements are below */
let siteTitle;
let introModal;
let loaderModal;
let closeSpan;
let aboutButton;
let playModeButton;
let aiModeButton;
let pauseButton;
let saveButton;
let loadButton;
let analysisButton;
let counter = 0; // counts drawing phase
let currentGameScore = 0;
let highestGameScore = -Infinity;
let currentNeuron = 0; // measures a current neuron performance
let highestNeuron = -Infinity; // highest neuron performance
let slider;
/* 
* slider determines how many operations done every drawing phase 
* the larger the faster drawn movement looks
*/
let isSmartPhone = false;
// url for the backend api
let url = "https://vast-lake-55314.herokuapp.com/api/people";
let brainJSON;

function preload() {
    birdImg = loadImage('images/flappy_bird.png');
    bgImg = loadImage('images/red_sky_bg.jpg');
    pipeImg = loadImage('images/pipe.png');
    pipeTopImg = loadImage('images/pipes_top.png');
}

function setup() {
    // the following checks if user device is a smartphone
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
        nnCanvas = createCanvas(windowWidth, windowHeight / 1.6);
        isSmartPhone = true;
    }
    else {
        nnCanvas = createCanvas(windowWidth / 1.5, windowHeight / 1.6);
    }
    nnCanvas.mousePressed(canvasPressed);
    nnCanvas.parent('nn-sketch');
    /* initialize birds */
    for (let i = 0; i < TOTAL; i++) {
        birds[i] = new Bird();
    }
    objectInit();
}

function draw() {
    /* background image of the game canvas */
    image(bgImg, 0, 0, width, height);

    /* When the AI mode is ON */
    if (!playMode) {
        if (!loopPaused) {
          // this for-loop speeds up the drawing 
          // (it doesn't affect the NN-learning process)
            for (let t = 0; t < slider.value(); t++) {
                // calculate frame rates
                counterUtil();

                // update pipes
                for (let i = pipes.length - 1; i >= 0; i--) {
                    pipes[i].update();

                    if (!aiLoadedMode) {
                        // check if each bird hits pipes. if so delete it
                        for (let j = birds.length - 1; j >= 0; j--) {
                            if (pipes[i].hits(birds[j])) {
                                savedBirds.push(birds.splice(j, 1)[0]);
                            }
                        }
                    } else { // when having a loaded bird play
                        if (pipes[i].hits(loadedBird)) { // when the bird hits a pipe
                            console.log('hits a pipe');
                            // gameOverPhase(loadedBird);
                            // noLoop();
                        }
                    }

                    // if pipes are off the screen, delete it.
                    if (pipes[i].offscreen()) {
                        pipes.splice(i, 1);
                    }
                }

                if (!aiLoadedMode) {
                    // checks if birds are off the screen
                    for (let i = birds.length - 1; i >= 0; i--) {
                        if (birds[i].offScreen()) {
                          savedBirds.push(birds.splice(i, 1)[0]);
                        }
                    }
                    for (let bird of birds) {
                        bird.think(pipes);
                        bird.update();
                        currentNeuron = bird.score;
                    }
                    regenerateBirds();
                } else {
                    if (loadedBird.offScreen()) { // a bird off the screen
                        noLoop();
                    }
                    loadedBird.think(pipes);
                    loadedBird.update();
                    currentNeuron = loadedBird.score;
                }

            }
            /* draw triangles (KEEP THIS POSITION)*/
            analysisTriangles();
        }
        // at the very beginning of the AI mode
        else if (counter == 0) {
            drawAIIntro();
        }

        /* shows the birds */
        if (!aiLoadedMode) {
            for (let bird of birds) {
                bird.show();
            }
        } else {
            loadedBird.show();
        }
    }

    /* Player Mode below */
    else if (playMode) {
        if (playerPaused) {
            if (!gameIsOver) {
                drawPlayIntro();
            }
        } else {
            // calculate frame rates
            counterUtil();

            playerBird.update();

            /* when the game is over for getting off-screen */
            if (playerBird.offScreen()) {
                gameIsOver = true;
                playerPaused = true;
            }

            // pipes updates
            for (let i = pipes.length - 1; i >= 0; i--) {
                pipes[i].update();
                /* when the game is over for hitting */
                if (pipes[i].hits(playerBird)) {
                    gameIsOver = true;
                    playerPaused = true;
                }

                if (pipes[i].offscreen()) {
                    pipes.splice(i, 1);
                }
            }
        }
        playerBird.show();
    }

    // show game information (Mode, Score, Pipes)
    drawOnCanvas();
    if (gameIsOver) {
        gameOverPhase(playerBird);
    }
}

function objectInit() {
    aboutButton = select('#about');
    aboutButton.mousePressed(() =>
        select('#myModal').style('display', 'block')
    )

    introModal = select('#introModal');
    if (isSmartPhone) {
        introModal.style('width', '75%');
    }

    closeSpan = select('.close');
    closeSpan.mousePressed(() =>
        select('#myModal').style('display', 'none')
    );

    loaderModal = select('.loader-modal');
    loaderModal.style('display', 'none');

    aiModeButton = createButton('AI Mode');
    aiModeButton.mousePressed(toggleAiMode);
    aiModeButton.parent('scores');
    aiModeButton.class('selected-button');

    playModeButton = createButton('Player Mode');
    playModeButton.mousePressed(togglePlayMode);
    playModeButton.parent('scores');
    playModeButton.class('button');

    slider = createSlider(1, 20, 1);
    slider.parent('speed-slider');
    slider.class('slider');
    if (isSmartPhone) {
        slider.style('width', '55%');
    }

    pauseButton = createButton('Start AI');
    pauseButton.mousePressed(toggleLoop);
    pauseButton.parent('control-buttons');
    pauseButton.class('button');

    saveButton = createButton('Save Bird');
    saveButton.mousePressed(saveBird);
    saveButton.parent('control-buttons');
    saveButton.class('button');

    loadButton = createButton('Load Bird');
    loadButton.mousePressed(loadBird);
    loadButton.parent('control-buttons');
    loadButton.class('button');

    analysisButton = createButton('Analysis Off');
    analysisButton.mousePressed(analyze);
    analysisButton.parent('control-buttons');
    analysisButton.class('button');
}

function keyPressed() {
    if (gameIsOver && keyCode === ENTER) {
        gameIsOver = false;
        resetGame();
    }
    else if (!gameIsOver && playMode && key == ' ') {
        if (playerPaused) {
            playerPaused = false;
        }
        playerBird.up();
    }
}

function canvasPressed() {
    if (gameIsOver) {
        gameIsOver = false;
        resetGame();
    }
    else if (!gameIsOver && playMode) {
        if (playerPaused) {
            playerPaused = false;
        }
        playerBird.up();
    }
}

function togglePlayMode() {
    if (!playMode) {
        /* toggle button appearances */
        playModeButton.removeClass('button');
        playModeButton.class('selected-button');
        aiModeButton.removeClass('selected-button');
        aiModeButton.class('button');

        /* initialize the player mode state */
        resetGame();
    }
}

function toggleAiMode() {
    if (playMode) {
        /* toggle button appearances */
        playModeButton.removeClass('selected-button');
        playModeButton.class('button');
        aiModeButton.removeClass('button');
        aiModeButton.class('selected-button');

        /* initializes the AI mode state */
        resetAI();
    }
}

function resetGame() {
    /* reset game functionalities */
    pipes = [];
    playerBird = new Bird();
    currentGameScore = 0;
    counter = 0;
    playMode = true;
    playerPaused = true;
    /* reset elements appearances */
    pauseButton.removeClass('button');
    pauseButton.class('disabled-button');

    saveButton.removeClass('button');
    saveButton.class('disabled-button');

    loadButton.removeClass('button');
    loadButton.class('disabled-button');

    analysisButton.removeClass('button');
    analysisButton.class('disabled-button');

    slider.removeClass('slider');
    slider.class('disabled-slider');
}

function resetAI() {
    /* reset game functionalities */
    pipes = [];
    for (let i = 0; i < TOTAL; i++) { // initializes birds
        birds[i] = new Bird();
    }
    counter = 0; currentGameScore = 0;
    loopPaused = true;
    playMode = false;
    gameIsOver = false;
    /* reset elements appearances */
    pauseButton.html('Start AI')
    pauseButton.removeClass('disabled-button');
    pauseButton.class('button');

    saveButton.removeClass('disabled-button');
    saveButton.class('button');

    loadButton.removeClass('disabled-button');
    loadButton.class('button');

    analysisButton.removeClass('disabled-button');
    analysisButton.class('button');

    slider.removeClass('disabled-slider');
    slider.class('slider');
}

function toggleLoop() {
    if (loopPaused) {
        pauseButton.html('PAUSE');
        // loadButton.removeClass('button');
        // loadButton.class('disabled-button');
    } else {
        pauseButton.html('RESUME');
        // loadButton.removeClass('disabled-button');
        // loadButton.class('button');
    }
    loopPaused = !loopPaused;
}

function analyze() {
    if (analysisMode) {
        analysisMode = false;
        analysisButton.html('Analysis On');
    } else {
        analysisMode = true;
        analysisButton.html('Analysis Off');
    }
}

function saveBird() {
    loaderModal.style('display','block');

    let birdBrain = birds[0];
    const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: birdBrain.brain.serialize()
    };

    fetch(`${url}/post/brain`, options)
        .then(response => {
            console.log(response);
            loaderModal.style('display','none');
        })
        .catch(err => console.error(err));
}

function loadBird() {
    loaderModal.style('display','block');

    if (!aiLoadedMode) {
        fetch(`${url}/get/brain`, { method: "GET" })
            .then(response => {
                return response.json();
            })
            .then(brainJSON => {
                console.log(brainJSON[0]);
                let birdBrain = NeuralNetwork.deserialize(brainJSON[0]);
                loadedBird = new Bird(birdBrain);

                resetAI();
                // modify the game functionality
                aiLoadedMode = true;
                saveButton.removeClass('button');
                saveButton.class('disabled-button');
                // modify the appearance of the canvas
                loadButton.html('Train Bird');
                loaderModal.style('display', 'none');
            })
            .catch(err => console.error(err));
    }
    else {
        fakeDelay()
            .then(() => {
                resetAI();
                aiLoadedMode = false;
                loadButton.html('Load Bird');
                saveButton.removeClass('disabled-button');
                saveButton.class('button');
                loaderModal.style('display', 'none');
            })
    }
}
