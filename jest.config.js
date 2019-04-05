module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'babel-jest'
  },
  // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  testRegex: '((/__tests__/.*)?(?<!\\.api|ui)\\.(test|api))\\.tsx?$', // Excludes .api.test.ts
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'babel-jest': {
      tsConfig: 'tsconfig.server.json'
    }
  }
};
