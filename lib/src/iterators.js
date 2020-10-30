import _ from 'lodash/fp.js'

export let differentLast = (normalCase, lastCase) => (acc, i, list) =>
  i === list.length - 1
    ? _.iteratee(lastCase)(acc, i, list)
    : _.iteratee(normalCase)(acc, i, list)
