module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '((/__tests__/.*)?(?<!\\.api|ui)\\.(test|api))\\.tsx?$', // Excludes .api.test.ts
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.server.json'
    }
  },
  setupFiles: [
    'reflect-metadata'
  ]
};
