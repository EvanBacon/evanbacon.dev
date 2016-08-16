Array.prototype.bubbleSort = function() {

var swapped;
  do {
    swapped = false;

    for (i = 0; i < this.length; i++) {
      if (this[i] < this[i+1]) {
        this.swap(i, i+1);
        swapped = true;
      }
    }
  } while(swapped);
  return this;
};



Array.prototype.mergeSort = function() {

 if (this.length < 2) {
  return this;
 } else {

   let merge = function(l,r) {
     let arr = [];
     while(l.length > 0 && r.length > 0) {
       arr.push(l[0] < r[0] ? l.shift() : r.shift());
     }
     return arr.concat(l).concat(r);
   };

   let middle = Math.floor(this.length/2);
   let lft = this.slice(0, middle).mergeSort();
   let rht = this.slice(middle).mergeSort();

    return merge(lft, rht);
  }
};


Array.prototype.swap = function(first, second) {
    let temp = this[first];
    this[first] = this[second];
    this[second] = temp;
  }
};

Array.prototype.partition = function(left, right) {
  var pivot = this[Math.floor((right + left) / 2)];

  while (left <= right) {
    while (this[left] < pivot) {
      left++;
    }
    while (this[right] > pivot) {
      right--;
    }
    if (left <= right) {
      this.swap(left, right);
      left++;
      right--;
    }
  }
  return left;
};

Array.prototype.quickSort = Array.prototype.quickSort || function(left = 0, right = -1) {
  if (right < 0) {
    right = this.length - 1;
  }
  var index;
  if (this.length > 1) {
    index = this.partition(left, right);
    if (left < index - 1)
      this.quickSort(left, index - 1);
    if (index < right)
      this.quickSort(index, right);
  }
  return this;
};


Array.prototype.insertionSort = Array.prototype.insertionSort || function() {
  var value;
  for (i = 0; i < this.length; i++) {
    value = this[i];
    for (j = i-1; j > -1 && this[j] > value; j--)
      this[j+1] = this[j];
    this[j+1] = value;
  }
  return this;
};

console.log([34,7,23,32,5,62].quickSort());

// for (i = 0; i < 10; i++) {
// }
