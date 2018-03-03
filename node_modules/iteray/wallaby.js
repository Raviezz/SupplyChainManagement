module.exports = function () {
  return {
    files: [
      'lib/**/*.js'
    ],

    tests: [
      'test/**/*.js'
    ],

    env: {
      type: 'node'
    }
  }
}
