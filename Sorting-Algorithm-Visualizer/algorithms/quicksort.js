async function quicksort(array, start, end) {
    if (start >= end) {
        states[start] = 1;
        states[end] = 1;
        return;
    }

    let index = await partition(array, start, end);
    await Promise.all([
        quicksort(array, start, index - 1),
        quicksort(array, index + 1, end)
    ]);
}

async function swap(array, i, j) {
    await sleep(swapSpeed);
    
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

async function partition(array, start, end) {
    let pivotIndex = start; 
    let pivotValue = array[end];
    states[pivotIndex] = 2;
    
    for (let i = start; i < end; i++) {
        if (array[i] < pivotValue) {
        await swap(array, i, pivotIndex);
        states[pivotIndex] = 0;
        pivotIndex++;
        states[pivotIndex] = 2;
        }
    }
    await swap(array, pivotIndex, end);
    // pivot value is always in a proper place after each recursion
    states[pivotIndex] = 1;
    return pivotIndex;
}

function drawQuickSort() {
    sorted = true; // checks if finished sorting

    for (let i = 0; i < values.length; i++) {
        if (states[i] == 1) { //1: sorted
            fill(colors.sorted);
        }   
        else if (states[i] == 2) { // 2: pivot values
            fill(colors.pivot); 
            sorted = false;
        } else {
            fill(colors.unsorted); 
            sorted = false;
        }
        stroke(colors.boxStroke);
        // coordinate system of the canvas
        rect((i * w) + padding, height - values[i], w, values[i]);
    }
}