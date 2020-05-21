// index.test.js
const { lint } = require('stylelint');

const config = {
	plugins: ['./index.js'],
	rules: {
		'plugin/no-restricted-imports': {
			paths: 'test/path',
			patterns: 'test/pattern/**/*.css'
		}
	}
};

// test that arrays of paths/patterns work as well
const configWithArrays = {
	plugins: ['./index.js'],
	rules: {
		'plugin/no-restricted-imports': {
			paths: ['test/path'],
			patterns: ['test/pattern/a/*.css','test/**/a.css']
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
		'\'test/path\' import is restricted from being used by a pattern. (plugin/no-restricted-imports)'
	);
	expect(line).toBe(1);
	expect(column).toBe(1);
});

it('supports arrays of restricted import paths/patterns', async () => {
	const {
		results: [{ warnings, parseErrors }]
	} = await lint({
		files: './test/has-restricted-imports.test.css',
		config: configWithArrays
	});

	expect(parseErrors).toHaveLength(0);
	expect(warnings).toHaveLength(3);

	const { line, column, text } = warnings[0];

	expect(text).toBe(
		'\'test/path\' import is restricted from being used by a pattern. (plugin/no-restricted-imports)'
	);
	expect(line).toBe(1);
	expect(column).toBe(1);
});
