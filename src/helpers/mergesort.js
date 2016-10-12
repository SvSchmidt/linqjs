/*
 * Modified Merge Sort implementation, originally written Nicholas C. Zakas
 * and released with MIT license
 * https://github.com/nzakas/computer-science-in-javascript/blob/master/algorithms/sorting/merge-sort-recursive/merge-sort-inplace.js
 */

/**
 * Merges to arrays in order based on the passed comparator or the default one
 * @param {Array} left The first array to merge.
 * @param {Array} right The second array to merge.
 * @return {Array} The merged array.
 */
function merge (left, right, comparator) {
  let result = []
  let il = 0
  let ir = 0

  while (il < left.length && ir < right.length){
    if (comparator(left[il], right[ir]) < 0) {
      result.push(left[il++])
    } else {
      result.push(right[ir++])
    }
  }

  return result.concat(left.slice(il)).concat(right.slice(ir))
}

/**
 * Sorts an array using the given comparator in mergesort
 *
 * @param {Array} items The array to sort.
 * @return {Array} The sorted array.
 */
function mergeSort (items, comparator = defaultComparator){
  if (items.length < 2) {
    return items
  }

  const middle = Math.floor(items.length / 2)
  const left = items.slice(0, middle)
  const right = items.slice(middle)

  const params = merge(
    mergeSort(left, comparator),
    mergeSort(right, comparator),
    comparator)

  // Add the arguments to replace everything between 0 and last item in the array
  params.unshift(0, items.length)
  items.splice.apply(items, params)

  return items
}
