module.exports = {
    globalSetup: "./test/setup.js",
    globalTeardown: "./test/teardown.js",
    testEnvironment: "./test/puppeteer-environment.js",
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    modulePathIgnorePatterns: [
        "<rootDir>/dist/"
    ],
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
};