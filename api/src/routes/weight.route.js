const weightController = require("../controllers/weight.controller");
const requestMiddleware = require("../middlewares/request.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (server) => {
  /**
   * Handle Pets
   */
  server
    .route("/weights")
    .post(
      authMiddleware.verifyToken,
      requestMiddleware.haveBodyContent,
      weightController.create
    );

  server
    .route("/weights/:petId")
    .get(authMiddleware.verifyToken, weightController.getWeightByPetId)
    .put(
      authMiddleware.verifyToken,
      requestMiddleware.haveBodyContent,
      weightController.update
    );

  server
    .route("/weights/:petId")
    .delete(authMiddleware.verifyToken, weightController.delete);
};
