const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

const fileListToExclude = [
	'/src/app/.*\\.html$',
	'/src/app/.*\\.index\\.ts$',
	'/src/app/.*\\.enum\\.ts$',
	'/src/app/.*\\.module\\.ts$',
	'/src/app/.*\\.actions\\.ts$',
	'/src/app/.*\\.template\\.ts$',
];

module.exports = {
	preset: 'jest-preset-angular',
	roots: ['<rootDir>/src/'],
	testMatch: ['**/+(*.)+(spec).+(ts)'],
	setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
	collectCoverage: true,
	transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
	coverageDirectory: 'coverage/cvs-app-vtm',
	testPathIgnorePatterns: ['/node_modules/', '/archive/', '/dist/', ...fileListToExclude],
	coveragePathIgnorePatterns: ['/src/mocks/', '/src/app/api/', ...fileListToExclude],
	testResultsProcessor: 'jest-sonar-reporter',
	workerThreads: true,
	moduleNameMapper: {
		...pathsToModuleNameMapper(compilerOptions.paths || {}, {
			prefix: '<rootDir>/',
		}),
		'@sentry/angular-ivy': '<rootDir>/node_modules/@sentry/angular-ivy/bundles/sentry-angular-ivy.umd.js',
	},
};
