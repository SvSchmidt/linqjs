  /*
  Aggregate, All, Alternate, Any, Average, BufferWithCount, CascadeBreadthFirst, CascadeDepthFirst, Catch, Choice, Concat,
  Contains, Count, Cycle, DefaultIfEmpty, Distinct, Do, ElementAt, ElementAtOrDefault, Empty, Except, Finally, First, FirstOrDefault,
  Flatten, ForEach, Force, From, Generate, GetEnumerator, GroupBy, GroupJoin, IndexOf, Insert, Intersect, Join, Last, LastIndexOf,
  LastOrDefault, Let, Matches, Max, MaxBy, MemoizeAll, Min, MinBy, OfType, OrderBy, OrderByDescending, Pairwise, PartitionBy,
  Range, RangeDown, RangeTo, Repeat, RepeatWithFinalize, Return, Reverse, Scan, Select, SelectMany, SequenceEqual, Share, Shuffle,
  Single, SingleOrDefault, Skip, SkipWhile, Sum, Take, TakeExceptLast, TakeFromLast, TakeWhile, ThenBy, ThenByDescending, ToArray,
  ToDictionary, ToInfinity,ToJSON, ToLookup, ToNegativeInfinity, ToObject, ToString, Trace, Unfold, Union, Where, Write, WriteLine, Zip
  */

  function Contains (elem) {
    return !!~this.indexOf(elem)
  }

  function First (predicate = x => true) {
    __assertFunction(predicate)

    const length = this.length

    for (let i = 0; i < length; i++) {
      if (predicate(this[i])) {
        return this[i];
      }
    }

    return null;
  }

  function Last (predicate = x => true) {
    __assertFunction(predicate)

    return this.reverse().First(predicate)
  }

  function install () {
    __assign(Array.prototype, linqjs)
  }

  __export({ Contains, First, Last, install })
