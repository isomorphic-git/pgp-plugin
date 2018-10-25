module.exports = {
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        output: `./junit/TESTS-node-${process.version}-${
          process.platform
        }-${require('os').release()}.xml`
      }
    ]
  ],
  coverageReporters: ['lcov', 'cobertura']
}
