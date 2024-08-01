module.exports = (server) => {
  server
    .route("/v")
    .get((_, res) => res.json({ version: process.version }));
};
