// index.test.js
const { lint } = require("stylelint");

const config = {
	plugins: ["./index.js"],
	rules: {
		"plugin/at-import-no-unresolveable": [true]
	}
};

it("warns for unresolveable import", async () => {
	const {
		results: [{ warnings, parseErrors }]
	} = await lint({
		files: "fixtures/contains-unresolveable-import.css",
		config
	});

	expect(parseErrors).toHaveLength(0);
	expect(warnings).toHaveLength(1);

	const [{ line, column, text }] = warnings;

	expect(text).toBe(
		"Unexpected unresolveable import (plugin/at-import-no-unresolveable)"
	);
	expect(line).toBe(1);
	expect(column).toBe(1);
});
