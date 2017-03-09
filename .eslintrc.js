module.exports = {
    'extends': 'standard',
    plugins: [
        'mocha',
        'lodash-fp'
    ],
    rules: {
        indent: ['error', 4],
        'lodash-fp/consistent-compose': 'off',
        'lodash-fp/consistent-name': [ 'error', '_' ],
        'lodash-fp/no-argumentless-calls': 'error',
        'lodash-fp/no-chain': 'error',
        'lodash-fp/no-extraneous-args': 'error',
        'lodash-fp/no-extraneous-function-wrapping': 'error',
        'lodash-fp/no-extraneous-iteratee-args': 'error',
        'lodash-fp/no-for-each': 'off',
        'lodash-fp/no-partial-of-curried': 'error',
        'lodash-fp/no-single-composition': 'error',
        'lodash-fp/no-submodule-destructuring': 'error',
        'lodash-fp/no-unused-result': 'error',
        'lodash-fp/prefer-compact': 'error',
        'lodash-fp/prefer-composition-grouping': 'error',
        'lodash-fp/prefer-constant': [ 'error', { arrowFunctions: false } ],
        'lodash-fp/prefer-flat-map': 'error',
        'lodash-fp/prefer-get': 'error',
        'lodash-fp/prefer-identity': [ 'error', { arrowFunctions: false } ],
        'lodash-fp/preferred-alias': 'off',
        'lodash-fp/use-fp': 'error',
        'mocha/no-exclusive-tests': 'error',
        'mocha/no-skipped-tests': 'error',
        'mocha/handle-done-callback': 'error',
        'mocha/no-global-tests': 'error',
        'mocha/valid-suite-description': 'error',
        'mocha/no-sibling-hooks': 'error'
    }
}
