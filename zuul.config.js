module.exports = {
  ui: 'mocha-bdd',
  builder: 'zuul-builder-webpack',
  webpack: require('./webpack.test.js'),
  browsers: [
    {
      name: 'android',
      version: ['oldest', 'latest']
    },
    {
      name: 'chrome',
      version: ['oldest', 'latest']
    },
    {
      name: 'firefox',
      // Older versions of firefox are not passing, mostly caused by modern 
      // version of lodash.
      version: [18, 'latest']
    },
    {
      name: 'ie',
      version: 'latest'
    },
    {
      name: 'iphone',
      version: ['oldest', 'latest']
    },
    {
      name: 'safari',
      version: 'oldest..latest'
    },
    {
      name: 'microsoftedge',
      version: ['oldest', 'latest']
    },
    {
      name: 'opera',
      version: ['11', '12']
    }
  ]
}
