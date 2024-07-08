const mysql = require("mysql2");

let connection;

connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "root",
  database: process.env.MYSQL_NAME || "vetoo",
  charset: "utf8mb4",
});

console.log("[API] Connected to the database");

connection.on("error", async (err) => {
  console.error("[API] Database error", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNREFUSED") {
    // Reconnexion après 10 secondes en cas de perte de connexion
    setTimeout(connectWithRetry, 10000);
  } else {
    throw err; // Lancer une erreur pour d'autres types d'erreurs de base de données
  }
});

module.exports = connection;
