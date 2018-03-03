module.exports = function () {
  return {
    files: [
      'index.js',
      'lib/**/*.js',
      'test/**/*.json'
    ],

    tests: [
      'test/**/*.js'
    ],

    env: {
      type: 'node'
    }
  }
}
