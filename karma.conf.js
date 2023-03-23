// Karma configuration
// Generated on Tue Oct 03 2017 13:01:40 GMT-0700 (PDT)

let local = false

module.exports = function (config) {
  'use strict'

  let browsers
  let reporters
  let jsonReporter = {
    stdout: false,
    outputFile: 'browser-results.json', // defaults to none
  }

  switch (process.env.TEST_ENV) {
    case 'browser':
      browsers = Object.keys(customLaunchers)
      reporters = ['dots', 'json', 'saucelabs']
      break
    // default is local
    default:
      local = true
      browsers = ['Chrome']
      reporters = ['progress', 'json']
  }

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      // Load the babel polyfill
      'node_modules/babel-polyfill/dist/polyfill.js',
      // We need to use singl entry file to avoid circular import error between
      // `aspect.js` and `conversion.js`
      'src/index.js',
      'test/*.spec.js',
    ],

    webpack: {
      // kind of a copy of your webpack config
      devtool: 'inline-source-map', // just do inline source maps instead of the default
      mode: 'production',
      module: {
        rules: [
          {
            test: /(\.jsx|\.js)$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
            },
          },
          {
            // We need to transpile chai-as-promised to ES5
            test: require.resolve('chai-as-promised'),
            use: {
              loader: 'babel-loader',
            },
          },
        ],
      },
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // add webpack as preprocessor
      'src/*.js': ['webpack', 'sourcemap'],
      'test/*.js': ['webpack', 'sourcemap'],
      // We need to transpile chai-as-promised to ES5
      [require.resolve('chai-as-promised')]: ['webpack'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: reporters,
    // Write testing results to json file.
    jsonReporter: jsonReporter,

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: local,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome'],
    sauceLabs: {
      testName: 'Futil-js browser tests',
      recordVideo: local,
      recordScreenshots: local,
    },
    captureTimeout: 360 * 1000,
    browserNoActivityTimeout: 600 * 1000,
    browserDisconnectTimeout: 60 * 1000,
    browserDisconnectTolerance: 3,
    browsers: browsers,
    customLaunchers: !local && customLaunchers,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: !local,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 5,
  })
}

// Browsers to run on Sauce Labs
// Check out https://saucelabs.com/platforms for all browser/OS combos
// UPDATED to match angular's config https://github.com/angular/angular.js/blob/master/karma-shared.conf.js
let customLaunchers = {
  SL_Chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest',
  },
  'SL_Chrome-1': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest-1',
  },
  SL_Firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest',
  },
  'SL_Firefox-1': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest-1',
  },
  'SL_Safari-1': {
    base: 'SauceLabs',
    browserName: 'safari',
    version: 'latest-1',
  },
  SL_Safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    version: 'latest',
  },
  // 'SL_IE_9': {
  //   base: 'SauceLabs',
  //   browserName: 'internet explorer',
  //   platform: 'Windows 2008',
  //   version: '9'
  // },

  SL_IE_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11',
  },
  SL_EDGE: {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    platform: 'Windows 10',
    version: 'latest',
  },
  'SL_EDGE-1': {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    platform: 'Windows 10',
    version: 'latest-1',
  },
  SL_iOS: {
    base: 'SauceLabs',
    browserName: 'iphone',
    version: 'latest',
  },
  'SL_iOS-1': {
    base: 'SauceLabs',
    browserName: 'iphone',
    version: 'latest-1',
  },
}
