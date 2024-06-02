const database = require("../utils/database.js");

const Pet = (pet) => {
  this.name = pet.name;
  this.type = pet.type;
  this.picture_url = pet.picture_url;
  this.chip = pet.chip;
  this.birthdate = pet.birthdate;
  this.gender = pet.gender;
  this.user_id = pet.user_id;
};

Pet.create = (newPet, ownerId, result) => {
  if (!newPet.name || !newPet.type || !newPet.gender)
    return result({ kind: "content_not_found" }, null);

  if (newPet.name.length > 20)
    return result({ kind: "content_too_long" }, null);

  newPet.user_id = ownerId;

  database.query(`INSERT INTO pets SET ?`, newPet, (err, data) => {
    if (err) {
      console.log("error: ", err);
      return result(null, err);
    }

    result(null, { id: data.insertId, ...newPet });
  });
};

Pet.findByUserId = (userId, result) => {
  database.query(
    `SELECT birthdate, chip, created_at, gender, id, name, picture_url, type FROM pets WHERE user_id = ?`,
    userId,
    (err, data) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      result(null, data);
    }
  );
};

module.exports = Pet;
