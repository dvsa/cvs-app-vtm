import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		clearMocks: false,
		sequence: {
			hooks: 'list',
		},
		reporters: ['default', 'junit'],
		outputFile: {
			junit: './coverage/test-report.xml',
		},
		coverage: {
			reportsDirectory: './coverage/cvs-app-vtm',
			exclude: [
				'src/mocks/**',
				'src/app/api/**',
				'src/app/**/*.html',
				'src/app/**/*.index.ts',
				'src/app/**/*.enum.ts',
				'src/app/**/*.module.ts',
				'src/app/**/*.actions.ts',
				'src/app/**/*.template.ts',
				'src/**/*.spec.ts',
			],
		},
	},
});
