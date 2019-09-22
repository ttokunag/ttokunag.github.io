async function mergeSort(array, start, end) {
  if (start >= end) {
      return;
  } 
  else {
      let mid = floor((start + end) / 2);
      
      Promise.all([
      await mergeSort(array, start, mid),
      await mergeSort(array, mid+1, end)
      ]);
      await merge(array, start, mid, end);
  }
}

async function merge(array, start, mid, end) {
  for (let i = start; i <= end; i++) {
      states[i] = 2;
  }

  let size1 = mid - start + 1;
  let size2 = end - mid;
  let lastMerge = (size1 + size2 == array.length);
  
  let left = new Array(size1);
  let right = new Array(size2);
  for (let i = 0; i < size1; i++) {
      left[i] = array[start+i];
  }
  for (let i = 0; i < size2; i++) {
      right[i] = array[mid+i+1];
  }
  
  let idxL = 0; let idxR = 0;
  let k = start;
  while (idxL < size1 && idxR < size2) {
      await sleep(swapSpeed);
      if (left[idxL] <= right[idxR]) {
          array[k] = left[idxL];
          idxL++;
      }
      else {
          array[k] = right[idxR];
          idxR++;
      }
      if (lastMerge) {
          states[k] = 1;
      } else {
          states[k] = 3;
      }
      k++;
  }
  while (idxL < size1) {
      await sleep(swapSpeed);
      array[k] = left[idxL];
      idxL++; 
      if (lastMerge) {
          states[k] = 1;
      } else {
          states[k] = 3;
      }
      k++;
  }
  while (idxR < size2) {
      await sleep(swapSpeed);
      array[k] = right[idxR];
      idxR++; 
      if (lastMerge) {
          states[k] = 1;
      } else {
          states[k] = 3;
      }
      k++;
  }

  for (let i = start; i <= end; i++) {
      if (lastMerge) {
          states[i] = 1;
      } else {
          states[i] = 0;
      }
  }
}

function drawMergeSort() {
  sorted = true;

  for (let i = 0; i < values.length; i++) {
      if (states[i] == 1) { // sorted
          fill(colors.sorted);
      } else if (states[i] == 2) { // target section
          fill(colors.merge);
      } else if (states[i] == 3) { // semi-sorted
          fill(colors.semiSorted);
      } else { // unsorted
          fill(colors.unsorted);
          sorted = false;
      }
      stroke(colors.boxStroke);
      rect((i * w) + padding, height - values[i], w, values[i]);
  }
}