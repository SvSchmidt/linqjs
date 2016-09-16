function Where (predicate = (elem, index) => true) {
  __assertFunction(predicate)

  return filterArray(this, predicate)
}

__export({ Where })
