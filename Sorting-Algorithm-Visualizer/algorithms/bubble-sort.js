function bubbleSort() {
    sorted = false;
    slow = 0;
}

function drawBubbleSort() {
    if (slow < values.length) {
        for (let j = 0; j < values.length-slow-1; j++) {
            if (values[j] > values[j + 1]) {
                let temp = values[j];
                values[j] = values[j + 1];
                values[j + 1] = temp;
            }
        }
        states[values.length-slow-1] = 1;
        slow++;
    } else if (slow != Number.MAX_VALUE) {
        sorted = true;
        slow = Number.MAX_VALUE;
    }

    for (let i = 0; i < values.length; i++) {
        if (states[i] == 1) {
            fill(colors.sorted);
        } else {
            fill(colors.unsorted);
        }
        stroke(colors.boxStroke);
        rect((i * w) + padding, height - values[i], w, values[i]);
    }
}

function sloMoBubbleSort() {
    if (slow < values.length-1) {
        if (fast < values.length-slow-1) {
            states[fast] = 2;
            if (fast > 0) {
                states[fast - 1] = 0;
            }
            if (values[fast] > values[fast + 1]) {
                swap(values, fast, fast + 1);
            } else {
                fast++;
            }
        }
        else {// when the fast reached the last
            slow++;
            states[fast] = 1;
            if (fast > 0) {
                states[fast - 1] = 0;
            }
            fast = 0;
        }
    } else if (slow != Number.MAX_VALUE) {// when all sorted 
        states[fast] = 1;
        sorted = true;
        slow = Number.MAX_VALUE;
    }

    for (let i = 0; i < values.length; i++) {
        if (states[i] == 1) {
            fill(colors.sorted);
        } else if (states[i] == 2) {
            fill(colors.pivot);
        } else {
            fill(colors.unsorted);
        }
        stroke(colors.boxStroke);
        rect((i * w) + padding, height - values[i], w, values[i]);
    }
}