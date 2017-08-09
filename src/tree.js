import _ from 'lodash/fp'

export let isTraversable = x => _.isArray(x) || _.isPlainObject(x)
