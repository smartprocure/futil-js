import React from 'react'
let tagDocs = {
  lens: (
    <>
      {`A lens is a getter and setter pair. You use them to write code that needs to read and write a value (like a method to flip a boolean switch, or a React component that reads and writes some state) without worrying about the implementation.

Functions that operate on lenses can handle a few different "shorthand" structures. This is similar to lodash's _.iteratee (which allows their methods to treat strings, objects, or functions as shorthand predicates)

A lens can be any of these formats:

({ get, set }) An object with a get function and set function. Found in: MobX "boxed observables" Example Usage: F.flip({ get, set })

([value, setter]) An array of the value and a setter function to change it. Found in: React's useState hook Example Usage: F.flip([value, setter])

(lookup, object) A lookup path and object pair e.g. ('key', object). The lookup path is anything you can pass to _.get (so nested paths with . or as an array are supported) Found in: MobX observable objects, native JS objects Example Usage: F.flip(lookup, object)

(x => {}) A function which returns the value when called with no arguments and sets it when called with one. Found in: Knockout observables, jQuery plugin APIs Example Usage: F.flip(x => {})

(getter, setter) A getter and setter pair. Found in: Anywhere you have a getter and setter function Example Usage: F.flip(getter, setter)

Note: Setter methods are generally mutable (unlike Ramda's lenses, for example).

We've included a few example "bindings" on F.domLens. These take a lens and return an object that's useful in a DOM context (like React or raw JS). In React terms, they're methods that generate the props you'd use to do two way binding to a lens.
      `}
      <img src="http://giphygifs.s3.amazonaws.com/media/1jnyRP4DorCh2/giphy.gif" />
    </>
  ),
  object: <p>Things that work with objects</p>,
  lang: <p>Language level utilities</p>,
  aspect: (
    <>
      <p>
        {' '}
        Aspects provide a functional oriented implementation of Aspect Oriented
        Programming. An aspect wraps a function and allows you run code at
        various points like before and after execution. Notably, aspects in this
        library allow you to have a shared state object between aspects and are
        very useful for automating things like status indicators, etc on
        functions.
      </p>
      <p>
        There is a <em>lot</em> of prior art in the javascript world, but most
        of it assumes a vaguely object oriented context. The implementation in
        `futil-js` is done in just 20 lines of code and seems to capture all of
        the use cases of AOP.
      </p>
      <blockquote>
        <b>Note:</b> To do OO style AOP with this these aspects, just use
        lodash's `_.update` method and optionally `boundMethod` from `futil` if
        `this` matters
      </blockquote>
      <blockquote>
        <b>Caveat:</b> While you can and should compose (or `_.flow`) aspects
        together, don't put non aspects in the middle of the composition.
        Aspects rely on a `.state` property on the wrapped function that they
        propagate through, but the chain will break if a non-aspect is mixed in
        between. Additionally, if you need external access to the state, make
        sure the aspects are the outer most part of the composition so the
        `.state` property will be available on the result of the composition.
      </blockquote>
      <p>
        There are a few basic aspects included on `F.aspects` (E.g. `var
        loggedFunc = F.aspect(F.aspects.logs)(func)`) because they seem to be
        universally useful. All of the provided aspects take an `extend` function
        to allow customizing the state mutation method (e.g. in mobx, you'd use
        `extendObservable`). If null, they default to `defaultsOn` from `futil-js`
        - check the unit tests for example usage.
      </p>
    </>
  ),
  tree: (
    <>
      <p>
        All tree functions take a traversal function so that you can customize
        how to traverse arbitrary nested structures.
      </p>
      <p>
        <b>Note</b> Be careful about cyclic structures that can result in
        infinite loops, such as objects with references to itself. There are
        cases where you'd intentionally want to visit the same node multiple
        times, such as traversing a directed acyclic graph (which would work
        just fine and eventually terminate, but would visit a node once for each
        parent it has connected to it) - but it's up to the user to be sure you
        don't create infinite loops.
      </p>
    </>
  )
}

export default tagDocs