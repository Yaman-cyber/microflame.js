module.exports = {
  testEnvironment: "node",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$",
  setupFilesAfterEnv: ["./tests/setup-tests.js"],
  moduleFileExtensions: ["js", "json", "jsx", "node", "mjs"],
  transform: {},
};
