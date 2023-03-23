import _ from 'lodash/fp'

export let stringify = (data) => JSON.stringify(data, 0, 2)

export let joinWith = _.curry((f, data) => _.flow(_.map, _.join(''))(f, data))

// Gets a tag value from a jsdoc entry
export let getTag = (tag, x) => _.get('text', _.find({ title: tag }, x.tags))
