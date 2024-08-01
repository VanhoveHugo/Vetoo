const request = require("supertest");
const app = require("../src/server.js");

describe("Compliance Audit Tests", () => {
  it("should return Node.js version", async () => {
    const response = await request(app).get("/v");
    expect(response.body).toEqual({ version: process.version });
  });

  it("should be running on Node.js v20.10.0", async () => {
    const nodeVersion = process.version;
    expect(nodeVersion).toBe("v20.10.0");
  });

  it("should return a valid JSON response", async () => {
    const response = await request(app).get("/v");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(() => JSON.parse(response.text)).not.toThrow();
  });
});
