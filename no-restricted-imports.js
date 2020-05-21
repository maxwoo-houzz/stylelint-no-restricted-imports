const stylelint = require('stylelint');
const ignore = require('ignore'); // using same glob matcher as es-lint
const isString = require('lodash.isstring');

const ruleName = 'houzz/no-restricted-imports';
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

					// may not work, see https://github.com/kaelzhang/node-ignore/issues/60
					patterns: [pattern => ignore.isPathValid(pattern)]
				}
			}
		);

		if (!validOptions) {
			return;
		}

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
				report({
					message: messages.rejected(uri),
					node: atRule,
					result,
					ruleName,
				});

				return;
			}
		});
	};
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
