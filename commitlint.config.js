// https://github.com/conventional-changelog/commitlint/blob/master/@commitlint/config-conventional/index.js
// https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md
module.exports = {
	extends: ['@commitlint/config-conventional'],
	plugins: ['commitlint-plugin-function-rules'],
	rules: {
		'type-enum': [
			2,
			'always',
			// in addtition to angular defaults, we add additional type for commits, breaking, breaking_change will force a major release with semantic-release
			// any body of commit containing BREAKING_CHANGE, BREAKING, etc.. will do too, please refer to the .releaserc.json file
			['revert', 'feat', 'test', 'perf', 'fix', 'chore', 'ci', 'docs', 'breaking_change', 'breaking', 'refactor'],
		],
		'subject-case': [1, 'always', 'lower-case'],
		// disable it to allow release notes from semantic-release to happen when releasing
		'footer-max-line-length': [0],
		'body-max-line-length': [0],
	},
};
