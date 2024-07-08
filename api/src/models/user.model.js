const database = require("../utils/database.js");
const bcrypt = require("bcrypt");

const User = (user) => {
  this.name = user.name;
  this.email = user.email;
  this.password = user.password;
};

/**
 * Authentication
 */
User.create = async (newUser, result) => {
  try {
    // Check if content is missing
    if (!newUser.name || !newUser.email || !newUser.password) {
      return result(
        { kind: "content_not_found", message: "Required fields are missing" },
        null
      );
    }

    // Check if content is too long
    if (newUser.name.length > 20 || newUser.email.length > 255) {
      return result(
        { kind: "content_too_long", message: "Content exceeds allowed length" },
        null
      );
    }

    // Check if email format is valid
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(newUser.email)) {
      return result(
        { kind: "content_invalid", message: "Invalid email format" },
        null
      );
    }

    // Check if email already exists
    const emailExists = await new Promise((resolve, reject) => {
      database.query(
        `SELECT email FROM users WHERE email = ?`,
        newUser.email,
        (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data.length > 0);
        }
      );
    });

    if (emailExists) {
      return result(
        { kind: "content_duplicate", message: "Email already exists" },
        null
      );
    }

    // Check if password is too short
    if (newUser.password.length < 8) {
      return result(
        { kind: "content_too_short", message: "Password is too short" },
        null
      );
    }

    // Hash password
    newUser.password = bcrypt.hashSync(newUser.password, 10);

    // Create user
    database.query(`INSERT INTO users SET ?`, newUser, (err, data) => {
      if (err) {
        console.error("Error: ", err.message);
        return result(null, { kind: "database_error", message: err.message });
      }
      result(null, { id: data.insertId, ...newUser });
    });
  } catch (error) {
    console.error("Unexpected error: ", error.message);
    result(null, {
      kind: "unexpected_error",
      message: "An unexpected error occurred",
    });
  }
};

User.login = (email, password, result) => {
  database.query(
    `SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1`,
    email,
    (err, data) => {
      if (err) {
        console.error(err);
        result(null, err);
        return;
      }

      if (data.length === 0) {
        result(null, null);
        return;
      }
      if (!bcrypt.compareSync(password, data[0].password)) {
        result({
          kind: "password_mismatch",
          message: "Password does not match",
        }, null);
        return;
      }

      result(null, data[0]);
      return;
    }
  );
};

/**
 * Handle Users
 */
User.findById = (id, result) => {
  try {
    const query = `SELECT * FROM users WHERE id = ?`;
    database.query(query, [id], (err, data) => {
      if (err) {
        console.error("Error: ", err.message);
        result(
          {
            kind: "database_error",
            message: "An error occurred while querying the database",
          },
          null
        );
        return;
      }
      result(null, data);
    });
  } catch (error) {
    console.error("Unexpected error: ", error.message);
    result(
      { kind: "unexpected_error", message: "An unexpected error occurred" },
      null
    );
  }
};

User.getById = (id, result) => {
  try {
    // Vérifier si l'ID est fourni
    if (!id) {
      return result(
        { kind: "content_not_found", message: "User ID is required" },
        null
      );
    }

    // Requête pour obtenir l'utilisateur par ID
    const query = `SELECT name, email FROM users WHERE id = ?`;
    database.query(query, [id], (err, data) => {
      if (err) {
        console.error("Error: ", err.message);
        return result(
          {
            kind: "database_error",
            message: "An error occurred while querying the database",
          },
          null
        );
      }

      // Vérifier si l'utilisateur est trouvé
      if (data.length === 0) {
        return result(
          { kind: "user_not_found", message: `User with ID ${id} not found` },
          null
        );
      }

      // Retourner les données de l'utilisateur
      result(null, data[0]);
    });
  } catch (error) {
    console.error("Unexpected error: ", error.message);
    result(
      { kind: "unexpected_error", message: "An unexpected error occurred" },
      null
    );
  }
};

User.all = (result) => {
  try {
    // Requête pour récupérer tous les utilisateurs
    const query = "SELECT name, email FROM users";
    database.query(query, (err, data) => {
      if (err) {
        console.error("Error: ", err.message);
        return result(
          {
            kind: "database_error",
            message: "An error occurred while querying the database",
          },
          null
        );
      }

      // Retourner les données des utilisateurs
      result(null, data);
    });
  } catch (error) {
    console.error("Unexpected error: ", error.message);
    result(
      { kind: "unexpected_error", message: "An unexpected error occurred" },
      null
    );
  }
};

module.exports = User;
