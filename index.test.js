// index.test.js
const { lint } = require('stylelint');

const config = {
	plugins: ['./index.js'],
	rules: {
		'houzz/no-restricted-imports': {
			paths: 'test/path',
			patterns: 'test/pattern/**/*.css'
		}
	}
};

it('reports restricted imports', async () => {
	const {
		results: [{ warnings, parseErrors }]
	} = await lint({
		files: './test/has-restricted-imports.test.css',
		config
	});

	expect(parseErrors).toHaveLength(0);
	expect(warnings).toHaveLength(3);

	const { line, column, text } = warnings[0];

	expect(text).toBe(
		'\'test/path\' import is restricted from being used by a pattern. (houzz/no-restricted-imports)'
	);
	expect(line).toBe(1);
	expect(column).toBe(1);
});
