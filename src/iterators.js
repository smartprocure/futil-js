import _ from 'lodash/fp'

export let differentLast = (normalCase, lastCase) => (acc, i, list) =>
  i === list.length - 1
    ? _.iteratee(lastCase)(acc, i, list)
    : _.iteratee(normalCase)(acc, i, list)

export let differentIndex = (normalCase, indexCase, index) =>
(acc, i) =>
  i === index
    ? _.iteratee(indexCase)(acc, i)
    : _.iteratee(normalCase)(acc, i);
