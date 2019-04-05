module.exports = {
  roots: ['<rootDir>'],
  testRegex: '\\.api\\.test\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'babel-jest': {
      tsConfig: 'tsconfig.server.json'
    }
  }
};
