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
      petController.create
    );

  server
    .route("/pets/:id")
    .get(authMiddleware.verifyToken, petController.getAllPets)
    .put(
      authMiddleware.verifyToken,
      requestMiddleware.haveBodyContent,
      petController.update
    );

  server
    .route("/pets/:petId")
    .delete(authMiddleware.verifyToken, petController.delete);
};
