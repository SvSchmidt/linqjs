function defaultEqualityCompareFn (first, second) {
  return toJSON(first) === toJSON(second)
}
