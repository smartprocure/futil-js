module.exports = {
    parser: 'babel-eslint',
    'extends': 'smartprocure',
    plugins: [
        'mocha'
    ],
    rules: {
        // Mocha plugin
        'mocha/no-exclusive-tests':      'error',
        'mocha/no-skipped-tests':        'error',
        'mocha/handle-done-callback':    'error',
        'mocha/no-global-tests':         'error',
        'mocha/no-return-and-callback':  'error',
        'mocha/valid-suite-description': 'error',
        'mocha/no-sibling-hooks':        'error',
        'mocha/no-identical-title':      'warn',
        // Because of should.be.true and so on
        'no-unused-expressions':         0,
        semi:                            0
    }
};
