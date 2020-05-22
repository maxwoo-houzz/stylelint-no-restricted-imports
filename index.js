const stylelint = require('stylelint');
const ignore = require('ignore'); // using same glob matcher as es-lint
const isString = require('lodash.isstring');
const valueParser = require('postcss-value-parser');

const ruleName = 'plugin/no-restricted-imports';
const messages = stylelint.utils.ruleMessages(ruleName, {
	rejected: (atImport) => `'${atImport}' import is restricted from being used by a pattern.`,
});

module.exports = stylelint.createPlugin(ruleName, function (blacklist) {
	return function (postcssRoot, postcssResult) {
		const validOptions = stylelint.utils.validateOptions(
			postcssResult,
			ruleName,
			{
				actual: blacklist,
				possible: {
					paths: [isString],
					patterns: [isString]
				}
			}
		);

		if (!validOptions) {
			return;
		}

		blacklist.paths = blacklist.paths === undefined
			? []
			: isString(blacklist.paths) ? [blacklist.paths] : blacklist.paths;


		blacklist.patterns = blacklist.patterns === undefined
			? []
			: isString(blacklist.patterns) ? [blacklist.patterns] : blacklist.patterns;

		const ignorer = ignore().add(blacklist.patterns);

		postcssRoot.walkAtRules(/^import$/i, (atRule) => {
			const params = valueParser(atRule.params).nodes;

			if (!params.length) {
				return;
			}

			// extract uri from url() if exists
			const uri =
				params[0].type === 'function' && params[0].value === 'url'
					? params[0].nodes[0].value
					: params[0].value;

			const isRestricted = blacklist.paths.includes(uri)
				|| ignorer.ignores(uri);

			if (isRestricted) {
				stylelint.utils.report({
					message: messages.rejected(uri),
					node: atRule,
					result: postcssResult,
					ruleName,
				});

				return;
			}
		});
	};
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
