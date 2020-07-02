import _ from 'lodash/fp'

// To work around mobx's observables
export let isArray = _.flow(_.result('slice'), _.isArray)
