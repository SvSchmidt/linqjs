// TODO: change implementation to use iterators!

function Order() {
    return this.OrderBy(defaultComparator);
}

function OrderCompare() {
    return this.sort(defaultComparator);
}

function OrderBy(comparator) {
    __assertFunction(comparator);
    let heap = new MinHeap(this, comparator);
    return getArrayFromIterable(heap);
}

function OrderDescending() {
    return this.OrderByDescending(defaultComparator);
}

function OrderByDescending(comparator) {
    __assertFunction(comparator);
    let heap = new MaxHeap(this, comparator);
    return getArrayFromIterable(heap);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getTimestamp() {
    return new Date().getTime();
}

function HeapSpeedTest() {
    let aFaster = 0;
    let bFaster = 0;
    let equallyFast = 0;
    for (let test = 1; test <= 100; test++) {
        let list = [];
        let length = getRandomInt(10, 1000 * test);
        let take = getRandomInt(1, 10);
        for (let i = 0; i < length; i++) {
            list.push(getRandomInt(-1000000, 1000000));
        }
        let listA = list;
        let listB = list.slice(0);
        console.log(`Test #${test} with ${length} random elements, taking the first ${take}:`);
        
        let startA = getTimestamp();
        let resA = listA.sort(defaultComparator).slice(0, take);
        let endA = getTimestamp();
        let timeA = endA - startA;
        console.log(` -> Array.sort() finished after ${timeA} milliseconds`);
        
        let startB = getTimestamp();
        let heap = new MinHeap(listB, defaultComparator);
        let iterator = heap[Symbol.iterator]();
        let resB = [];
        for (let i = 0; i < take; i++) {
            resB.push(iterator.next().value);
        }
        let endB = getTimestamp();
        let timeB = endB - startB;
        if (timeB > timeA) {
            console.warn(` -> Heap finished after ${timeB} milliseconds and took ${timeB - timeA} milliseconds longer`);
        } else {
            console.log(` -> Heap finished after ${timeB} milliseconds`);
        }

        let success = true;
        for (let i = 0; i < length; i++) {
            if (resA[i] !== resB[i]) {
                success = false;
                break;
            }
        }
        if (success) {
            console.log(' -> Finished successfully.');
        } else {
            console.error(' -> Finished with different results!', resA, resB);
        }

        if (timeA < timeB) {
            aFaster++;
        } else if(timeB < timeA) {
            bFaster++;
        } else {
            equallyFast++;
        }
    }

    let total = aFaster + bFaster + equallyFast;
    console.log(`Array.sort() was faster: ${aFaster}/${total}`);
    console.log(`Heap         was faster: ${bFaster}/${total}`);
    console.log(`Both where equally fast: ${equallyFast}/${total}`);
}

__export({ Order, OrderCompare, OrderBy, OrderDescending, OrderByDescending, HeapSpeedTest })