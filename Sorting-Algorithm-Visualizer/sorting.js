let values = [];
let states = [];
let w;
let swapSpeed;
let padding;
let sorted = false;
// For bubble & selection sort
let slow = Number.MAX_VALUE;
let fast = 0;
let keyValue;
// For DOMs
let colors;
let siteTitle;
let canvas;
// buttons for start & generate
let startButton;
let generateButton;
// array size & speed sliders
let sizeSlider; let sizeText;
let speedSlider; let speedText;
let algoText;
let algoNames = ['Quick', 'Merge','Bubble','Bubble (slo-mo)','Insert','Insert (slo-mo)'];
let algos = [
    quicksort, mergeSort, bubbleSort, bubbleSort, insertionSort, insertionSort
];
let draws = [
    drawQuickSort, drawMergeSort, drawBubbleSort, sloMoBubbleSort, 
    drawInsertionSort, sloMoInsertionSort
];
let algoButtons = []; let algoButtonStates = [];
let algoChosen = [algos[0], draws[0], 0];


function setup() {
    canvas = createCanvas(windowWidth, windowHeight / 1.35);
    canvas.parent('sketch-holder');

    objectInit();
    generateValues();

    algoButtonPressed(0);
}

function draw() {
    background(210);
    bottomLine();

    algoChosen[1]();
    // once sorting is done
    if (sorted) {
        // enable buttons & sliders
        startButton.removeClass('disabled-button');
        startButton.class('button');
        generateButton.removeClass('disabled-button');
        generateButton.class('button');
        sizeSlider.removeClass('disabled-slider');
        sizeSlider.class('slider');
        if (algoChosen[2] == 0 || algoChosen[2] == 1) {
            enableSpeedSlider();
        }
        for (let i = 0; i < algoButtons.length; i++) {
            algoButtons[i].style('pointer-events', 'auto');
        }
        // notify that sorting is done
        fill(0); textSize(24);
        text('Sorted!', width / 10, height / 10);
    }
}

function objectInit() {
    colors = {
        sorted: '#DDA0DD',
        unsorted: '#FFFFFF',
        pivot: '#C80000',
        merge: '#743A85',
        semiSorted: '#E6DCFA',
        boxStroke: '#646464',
        disabled: '#D3D3D3'
    }

    siteTitle = createElement('p', 'Sorting Algorithm Visualizer');
    siteTitle.parent('site-title')
    siteTitle.style('font-size', '20pt');
    siteTitle.style('padding-bottom', '20px');

    algoText = createButton('Algos');
    algoText.parent('algo-options'); algoText.class('fake-button');
    algoButtons = new Array(algoNames.length);
    algoButtonStates = new Array(algoNames.length);
    for (let i = 0; i < algoNames.length; i++) {
        algoButtonStates[i] = 0;
        algoButtons[i] = createButton(algoNames[i]);
        algoButtons[i].parent('algo-options');
        algoButtons[i].class('button'); // add a style
        algoButtons[i].mousePressed(() => {
            algoChosen[0] = algos[i];
            algoChosen[1] = draws[i];
            algoChosen[2] = i;
            algoButtonPressed(i);
        });
    }

    sizeText = createButton('Array Size'); 
    sizeText.parent('algo-options'); sizeText.class('fake-button');
    sizeSlider = createSlider(3, 92, 20);
    sizeSlider.input(generateValues);
    sizeSlider.parent('algo-options');
    sizeSlider.class('slider');
    w = sizeSlider.value();
    speedText = createButton('Speed'); 
    speedText.parent('algo-options'); speedText.class('fake-button');
    speedSlider = createSlider(0, 80, 25);
    speedSlider.changed(updateSpeed);
    speedSlider.parent('algo-options');
    speedSlider.class('slider');

    generateButton = createButton('Generate Values');
    generateButton.mousePressed(generateValues);
    generateButton.parent('algo-options');
    generateButton.class('button');

    startButton = createButton('START');
    startButton.mousePressed(startSorting);
    startButton.parent('algo-options');
    startButton.class('button');

    //padding = width * 0.015;
    padding = (width - floor(width * 0.97 / w) * w) / 2;
}

function generateValues() {
    w = sizeSlider.value();
    values = new Array(floor(width * 0.97 / w));
    for (let i = 0; i < values.length; i++) {
        values[i] = random(height * 0.97); 
        states[i] = 0; 
    }
}

function startSorting() {
    // reset each bar state
    for (let i = 0; i < states.length; i++) {
        states[i] = 0;
    }
    // disable the buttons
    startButton.removeClass('button');
    startButton.class('disabled-button');
    generateButton.removeClass('button');
    generateButton.class('disabled-button');
    disableSpeedSlider();
    sizeSlider.removeClass('slider');
    sizeSlider.class('disabled-slider');
    for (let i = 0; i < algoButtons.length; i++) {
        algoButtons[i].style('pointer-events', 'none');
    }
    // execute a program
    algoChosen[0](values, 0, values.length - 1);
}

function algoButtonPressed(index) {
    let disabledAlready = false;
    for (let i = 0; i < algoButtonStates.length; i++) {
        if (algoButtonStates[i] == 1) { // turn off the prev button
            algoButtons[i].removeClass('selected-button');
            algoButtons[i].class('button');
            algoButtonStates[i] = 0;
            if (!disabledAlready && (index == 0 || index == 1)) {
                enableSpeedSlider();
            }
        } else if (i == index) { // turn on the curr button
            algoButtonStates[i] = 1;
            algoButtons[i].removeClass('button');
            algoButtons[i].class('selected-button');
            if (index != 0 && index != 1) {
                disableSpeedSlider();
                disabledAlready = true;
            }
        } else { // do nothing for other buttons
            algoButtonStates[i] = 0;
        }
    }
}

function updateSpeed() {
    swapSpeed = Number(speedSlider.value());
}

function bottomLine() {
    stroke(0);
    strokeWeight(2);
    line(0, height, width, height);
    strokeWeight(1);
}

function disableSpeedSlider() {
    speedSlider.removeClass('slider');
    speedSlider.class('disabled-slider');
}

function enableSpeedSlider() {
    speedSlider.removeClass('disabled-slider');
    speedSlider.class('slider');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
