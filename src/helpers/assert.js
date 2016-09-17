  function __assert (condition, msg) {
    if (!condition) {
      throw new Error(msg);
    }
  }

  function __assertFunction (param) {
    __assert(isFunction(param), 'Parameter must be function!')
  }

  function __assertArray (param) {
    __assert(isArray(param), 'Parameter must be array!')
  }

  function __assertNotEmpty (arr) {
    __assert(isArray(arr))
    __assert(!isEmpty(arr), 'Sequence is empty')
  }
