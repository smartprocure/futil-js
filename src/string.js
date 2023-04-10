import { map } from './collection'
import _ from 'lodash/fp'
import { when } from './logic'
import { intersperse } from './array'
import { differentLast } from './iterators'
import { isBlank } from './lang'

let blankString = when(isBlank, '')
/**
 * Wraps a string with pre and post unless content is nil (and replaces )
 * @signature (pre, post, content) -> pre + content + post
 * @param {string} pre
 * @param {string} post
 * @param {string} content
 * @returns string
 */
export const wrap = _.curry((pre, post, content) =>
  isBlank(content)
    ? blankString(content)
    : blankString(pre) + content + blankString(post)
)
export const quote = wrap('"', '"')

/**
 * Wraps a string in parenthesis.
 *
 * @signature 'asdf' -> '(asdf)'
 */
export const parens = wrap('(', ')')
export const concatStrings = _.flow(_.compact, _.map(_.trim), _.join(' '))

/**
 * Maps `_.trim` through all the strings of a given object or array.
 *
 */
export const trimStrings = map(when(_.isString, _.trim))

// _.startCase does the trick, deprecate it!
/**
 * Converts strings like variable names to labels (generally) suitable for GUIs, including support for acronyms and numbers. It's basically `_.startCase` with acronym and number support.
 *
 * @signature string -> string
 */
export let autoLabel = _.startCase

/**
 * Creates a `{value, label}` which applies `autoLabel` the string parameter on puts it on the label property, with the original on the value property. You can also pass in an object with value or with both value and label.
 *
 * @signature string -> {value:string, label:string}
 */
export let autoLabelOption = (a) => ({
  value: when(_.isUndefined, a)(a.value),
  label: a.label || autoLabel(when(_.isUndefined, a)(a.value)),
})

/**
 * Applies `autoLabelOption` to a collection. Useful for working with option lists like generating select tag options from an array of strings.
 *
 * @signature [string] -> [{value:string, label:string}]
 */
export let autoLabelOptions = _.map(autoLabelOption)

/**
 * Just like `toSentence`, but with the ability to override the `separator` and `lastSeparator`
 *
 * @signature (separator, lastSeparator, array) => string
 * @example (' - ', ' or ', ['a', 'b', 'c']) -> 'a - b or c'
 */
export let toSentenceWith = _.curry((separator, lastSeparator, array) =>
  _.flow(
    when(_.isString, (x) => [x]),
    intersperse(
      differentLast(
        () => separator,
        () => lastSeparator
      )
    ),
    _.join('')
  )(array)
)

/**
 * Joins an array into a human readable string. See https://github.com/epeli/underscore.string#tosentencearray-delimiter-lastdelimiter--string
 *
 * @signature array => string
 * @example ['a', 'b', 'c'] -> 'a, b and c'
 */
export let toSentence = toSentenceWith(', ', ' and ')

/**
 * Allows passing a "cachizer" function (`array -> object`) to override the way `uniqueString`'s initial array is converted into a cache object. Can be curried to create a custom `uniqueString` function, eg: `let myUniqueString = uniqueStringWith(myFunc)`

Like `uniqueString`, the resulting deduplication function exposes `cache` and `clear()` properties.
 * 
 * @signature (fn, array) -> string -> string
 * @example let uniqueStringStripDigits = uniqueStringWith(
 *   _.countBy(_.replace(/(\d+)$/, ''))
 * )
 * let dedupe = uniqueStringStripDigits(['foo', 'foo42', 'foo3000'])
 * dedupe('foo') //-> 'foo3'
 * uniqueStringWith(_.identity, dedupe.cache)('foo') //-> 'foo4'
 */
export let uniqueStringWith = _.curry((cachizer, initialKeys) => {
  let f = (x) => {
    let result = x
    while (cache[result]) {
      result = x + cache[x]
      cache[x] += 1
    }
    cache[result] = (cache[result] || 0) + 1
    return result
  }
  let cache = cachizer(initialKeys)
  f.cache = cache
  f.clear = () => {
    cache = {}
    f.cache = cache
  }
  return f
})

/**
 * Returns a function that takes a string and de-duplicates it against an internal cache. Each time this function is called, the resulting deduplicated string is added to the cache. Exposes `cache` and `clear()` properties to read and clear the cache, respectively.
 *
 * @signature array -> string -> string
 * @example let dedupe = uniqueString()
 * _.map(dedupe, ['foo', 'foo', 'foo']) //-> ['foo', 'foo1', 'foo2']
 * dedupe.cache //-> { foo: 3, foo1: 1, foo2: 1 }
 * dedupe.clear()
 * dedupe.cache //-> {}
 * dedupe('foo') //-> 'foo'
 */
export let uniqueString = (arr = []) =>
  uniqueStringWith(_.countBy(_.identity), arr)

/**
 * Replaces whitespace substrings with a single space and trims leading/trailing whitespace
 *
 * @signature string -> string
 * @typescript <T>(x: T): string | T
 * @since 1.75.0
 */
export let crunchWhitespace = (x) =>
  _.isString(x) ? _.trim(_.replace(/\s+/g, ' ', x)) : x
