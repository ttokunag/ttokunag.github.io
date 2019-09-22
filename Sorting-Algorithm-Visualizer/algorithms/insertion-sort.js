function insertionSort() {
    sorted = false;
    slow = 1;
    fast = Number.MAX_VALUE;
}

function drawInsertionSort() {
    if (slow < values.length) {
        if (slow > 0) {
            states[slow - 1] = 1;
        }
        states[slow] = 2; // position of the rightmost pointer

        keyValue = values[slow];
        let j = slow - 1;
        while (j >= 0 && values[j] > keyValue) {
            values[j + 1] = values[j];
            j--;
        }
        values[j + 1] = keyValue;
        slow++;
    } else if (fast != 0) {
        // stop the operation
        states[slow - 1] = 1;
        slow = Number.MAX_VALUE;
        // reset to the original state
        sorted = true;
        fast = 0;
    }

    for (let i = 0; i < values.length; i++) {
        if (states[i] == 1) {
            fill(colors.sorted);
        } else if (states[i] == 2) {
            fill(colors.merge)
        } else {
            fill(colors.unsorted);
        }
        stroke(colors.boxStroke);
        rect(i * w + padding, height - values[i], w, values[i]);
    }
}

function sloMoInsertionSort() {
    if (slow < values.length) {
        states[slow] = 2; // position of the rightmost pointer
        if (fast == Number.MAX_VALUE) { // when the prev sort is done
            keyValue = values[slow];
            fast = slow - 1;
            states[fast] = 1;
        } else if (fast >= 0 && values[fast] > keyValue) {
            values[fast + 1] = values[fast];
            states[fast] = 0;
            fast--;
            states[fast] = 1;
        } else { // when the curr sort is done
            values[fast + 1] = keyValue;
            states[fast] = 0;
            fast = Number.MAX_VALUE;
            states[slow] = 0;
            slow++;
        }
    } else if (fast != 0) {
        // stop the operation
        slow = Number.MAX_VALUE;
        // color the sorted parts
        if (!sorted && fast != 0) {
            fast = 0;
        } 
        sorted = true;
        if (fast < values.length) {
            states[fast++] = 1;
        } else {
            fast = 0;
        }
    }

    for (let i = 0; i < values.length; i++) {
        if (states[i] == 1) {
            fill(colors.sorted);
        } else if (states[i] == 2) {
            fill(colors.merge)
        } else {
            fill(colors.unsorted);
        }
        stroke(colors.boxStroke);
        rect(i * w + padding, height - values[i], w, values[i]);
    }
}