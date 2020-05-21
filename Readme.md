StyleLint `no-restricted-imports` Plugin
======================================

### Install

```
npm install @maxwoo-houzz/stylelint-no-restricted-imports
```

### Usage

in your .stylelintrc file:

```json
{
	"plugins": ["@maxwoo-houzz/stylelint-no-restricted-imports"],
	"rules": {
		"plugin/no-restricted-imports": {
			"paths": ["test/path"],
			"patterns": ["test/pattern/**/*.css"]
		}
	}
}
```

The `paths` option supports either a string or array of strings, specifying _exact_ paths to blacklist.

The `patterns` option supports either a single string or array of strings, where each string must be a [.gitignore pattern](https://git-scm.com/docs/gitignore/2.1.4#_pattern_format).

So the above configuration will throw a linter error on any of the following imports:

```css
@import 'test/path';
@import 'test/pattern/a.css';
@import 'test/pattern/a/b.css';
```

### Test

```
npm test
```
