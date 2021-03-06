/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
	// Automatically clear mock calls and instances between every test
	clearMocks: true,

	// The directory where Jest should output its coverage files
	coverageDirectory: "coverage",

	// The test environment that will be used for testing
	testEnvironment: "node",

	setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};
