jest.mock("./src/middlewares/auth.middleware", () =>
  require("./tests/mocks/auth.middleware")
);
