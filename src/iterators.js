import _ from 'lodash/fp'

/**
 * Creates an iterator that handles the last item differently for use in any function that passes `(value, index, list)` (e.g. `mapIndexed`, `eachIndexed`, etc). Both the two handlers and the result are iterator functions that take `(value, index, list)`.
 *
 * @signature handleItem -> handleLastItem -> iterator
 */
export let differentLast = (normalCase, lastCase) => (acc, i, list) =>
  i === list.length - 1
    ? _.iteratee(lastCase)(acc, i, list)
    : _.iteratee(normalCase)(acc, i, list)
