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
User.create = (newUser, result) => {
  // Check if content is missing
  if (!newUser.name || !newUser.email || !newUser.password)
    return result({ kind: "content_not_found" }, null);

  // Check if content is too long
  if (newUser.name.length > 20 || newUser.email.length > 255)
    return result({ kind: "content_too_long" }, null);

  // Check if email format is valid
  if (newUser.email.match(/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/) === null) {
    result({ kind: "content_invalid" }, null);
    return;
  }

  // Check if email already exists
  database.query(
    `SELECT email FROM users WHERE email = ?`,
    newUser.email,
    (err, data) => {
      if (err) {
        console.log("error: ", err);
        return result(null, err);
      }

      if (data.length > 0) return result({ kind: "content_duplicate" }, null);
    }
  );

  // Check if password is too short
  if (newUser.password.length < 8) {
    result({ kind: "content_too_short" }, null);
    return;
  }

  // Hash password
  newUser.password = bcrypt.hashSync(newUser.password, 10);

  // Create user
  database.query(`INSERT INTO users SET ?`, newUser, (err, data) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, data);
    return;
  });
};

User.login = (email, password, result) => {
  database.query(
    `SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1`,
    email,
    (err, data) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (data.length === 0) {
        result(null, null);
        return;
      }

      if (!bcrypt.compareSync(password, data[0].password)) {
        result(null, null);
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
  database.query(`SELECT * FROM users WHERE id = ${id}`, (err, data) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, data);
    return;
  });
};

User.getById = (id, result) => {
  database.query(
    `SELECT name, email FROM users WHERE id = ${id}`,
    (err, data) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      result(null, data);
      return;
    }
  );
};

User.all = (result) => {
  database.query("SELECT name, email FROM users", (err, data) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, data);
    return;
  });
};

module.exports = User;
