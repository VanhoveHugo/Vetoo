const petController = require("../controllers/pet.controller");
const requestMiddleware = require("../middlewares/request.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (server) => {
  /**
   * Handle Pets
   */
  server
    .route("/pets")
    .post(
      authMiddleware.verifyToken,
      requestMiddleware.haveBodyContent,
      petController.createPet
    );
};
