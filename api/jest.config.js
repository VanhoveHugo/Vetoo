module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/*.js"],
  testTimeout: 60000,
  verbose: true,
  setupFiles: ["dotenv/config"],
};
