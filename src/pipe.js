/**
 * TODO: Complete the documentation...
 *
 * @param {Function} fn
 * @param {...(PipeParamPlaceholder|PipePrevResultPlaceholder)} args
 * @returns {*}
 */
export const pipe = (() => {
  const PipeParamPlaceholder = Symbol('Pipe Param Placeholder');
  const PipePrevResultPlaceholder = Symbol('Pipe Previous Return Placeholder');

  const pipeFactory = (callstack) => {
      return function(fn, ...args) {
          const p = (...pipeArgs) => {
              let argIndexCount = -1;
              return p.callstack.reduce((prevResult, currentCallstackItem) => {
                  return currentCallstackItem.fn.apply(undefined, currentCallstackItem.args.map((a) => {
                      switch (a) {
                          case PipePrevResultPlaceholder:
                              return prevResult;
                          case PipeParamPlaceholder:
                              argIndexCount++;
                              return pipeArgs[argIndexCount];
                          default:
                              throw new Error('Unknown pipe argument.  Use `pipe.param` or `pipe.$` to indicate a parameter and `pipe.prevResult` or `pipe._` to indicate the previous result.');
                      }
                  }));
              }, undefined);
          };
          p.callstack = [...callstack, {fn, args}];
          p.pipe = pipeFactory(p.callstack);
          return p;
      };
  }

  // Yes this is ugly, but there's no other way of telling the typechecker that this is a function with specific properties while using the const keyword.
  const p = pipeFactory([]);
  p.param = PipeParamPlaceholder;
  p.$ = PipeParamPlaceholder;
  p.prevResult = PipePrevResultPlaceholder;
  p._ = PipePrevResultPlaceholder;
  return p;
})();