import { fromRollup } from '@web/dev-server-rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import rollupCommonjs from '@rollup/plugin-commonjs'

let resolve = fromRollup(nodeResolve)
let commonjs = fromRollup(rollupCommonjs)

// Tests are run on the browser so the code needs to be transpiled
// That means bare module identifiers need to be replaced with relative paths
// and CommonJS needs to be converted to ESM
export default {
  plugins: [
    resolve(),
    commonjs({
      include: [
        './node_modules/lodash/**/*',
        './node_modules/sinon-chai/**/*',
        './node_modules/chai-as-promised/**/*',
        './node_modules/assertion-error/**/*',
        './node_modules/pathval/**/*',
        './node_modules/type-detect/**/*',
        './node_modules/get-func-name/**/*',
        './node_modules/deep-eql/**/*',
        './node_modules/check-error/**/*',
      ],
    }),
  ],
}
