// index.test.js
const { lint } = require('stylelint');

const DEFAULT_PATH = 'test/path';
const DEFAULT_PATTERN = 'test/pattern/**/*.css';

function buildTestConfig(paths, patterns) {
	return {
		plugins: ['./index.js'],
		rules: {
			'plugin/no-restricted-imports': {
				paths,
				patterns,
			}
		}
	};
}

it('reports restricted imports', async () => {
	let config = buildTestConfig(DEFAULT_PATH, DEFAULT_PATTERN);

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
	let config = buildTestConfig([DEFAULT_PATH], [DEFAULT_PATTERN]);

	const {
		results: [{ warnings, parseErrors }]
	} = await lint({
		files: './test/has-restricted-imports.test.css',
		config
	});

	expect(warnings).toHaveLength(3);
});

it('supports omitting path', async () => {
	let config = buildTestConfig(undefined, DEFAULT_PATTERN);
	delete config.rules['plugin/no-restricted-imports'].paths;

	const {
		results: [{ warnings, parseErrors }]
	} = await lint({
		files: './test/has-restricted-imports.test.css',
		config
	});

	expect(warnings).toHaveLength(2);
});

it('supports omitting patterns', async () => {
	let config = buildTestConfig(DEFAULT_PATH, undefined);
	delete config.rules['plugin/no-restricted-imports'].patterns;

	const {
		results: [{ warnings, parseErrors }]
	} = await lint({
		files: './test/has-restricted-imports.test.css',
		config
	});

	expect(warnings).toHaveLength(1);
});

it('supports re-including patterns', async () => {
	let config = buildTestConfig(DEFAULT_PATH, [
		'test/pattern/**/*.css',
		'!test/pattern/a.css',
		'!test/pattern/a/b.css',
	]);
	delete config.rules['plugin/no-restricted-imports'].patterns;

	const {
		results: [{ warnings, parseErrors }]
	} = await lint({
		files: './test/has-restricted-imports.test.css',
		config
	});

	expect(warnings).toHaveLength(1);
});
