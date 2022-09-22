const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  collectCoverage: true,
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  coverageDirectory: 'coverage/cvs-app-vtm',
  testPathIgnorePatterns: ['/node_modules/', '/archive/', '/dist/'],
  coveragePathIgnorePatterns: ['/src/mocks/'],
  testResultsProcessor: 'jest-sonar-reporter',
  globals: {
    crypto: require("crypto"),
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/'
  }),
  coverageProvider: 'v8'
};
