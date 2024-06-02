const userController = require("../controllers/user.controller");
const requestMiddleware = require("../middlewares/request.middleware");

module.exports = (server) => {
  /**
   * Authentication
   */
  server
    .route("/auth/register")
    .post(requestMiddleware.haveBodyContent, userController.register);

  server
    .route("/auth/login")
    .post(requestMiddleware.haveBodyContent, userController.login);

  /**
   * Handle Users
   */
  server.route("/users").get(userController.getAllUsers);

  server.route("/users/:userId").get(userController.getUserById);

  /**
   * Handle Account
   */
  server.route("/account").get(userController.getAccount);
};
