module.exports = {
  'extends': 'standard',
  plugins: [
    'mocha'
  ],
  env: {
    mocha: true
  },
  rules: {
    'mocha/no-exclusive-tests': 'error',
    'mocha/no-skipped-tests': 'error',
    'mocha/handle-done-callback': 'error',
    'mocha/no-global-tests': 'error',
    'mocha/valid-suite-description': 'error',
    'mocha/no-sibling-hooks': 'error',
  }
}
