const Pet = require("../src/models/pet.model.js");
const database = require("../src/utils/database.js");
const request = require("supertest");
const app = require("../src/server.js");
const jwt = require("jsonwebtoken");

let ownerId = 1;
let petId = 1;
const token = jwt.sign({ id: ownerId }, process.env.JWT_SECRET || "verySecret");

jest.mock("../src/utils/database", () => ({
  query: jest.fn(),
}));

describe("Pet Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a pet successfully", (done) => {
    const newPet = {
      name: "Buddy",
      type: "d",
      picture_url: "http://example.com/buddy.jpg",
      chip: "1234567890",
      birthdate: "2020-01-01",
      gender: "m",
    };

    database.query.mockImplementation((query, values, callback) => {
      callback(null, { insertId: 1 });
    });

    Pet.create(newPet, ownerId, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual({
        id: 1,
        ...newPet,
        user_id: ownerId,
      });
      done();
    });
  });

  it("should return an error if user is not logged in", (done) => {
    const newPet = {
      name: "Buddy",
      type: "d",
      picture_url: "http://example.com/buddy.jpg",
      chip: "1234567890",
      birthdate: "2020-01-01",
      gender: "m",
    };

    Pet.create(newPet, null, (err, result) => {
      expect(err).toEqual({ kind: "not_logged_in" });
      expect(result).toBeNull();
      done();
    });
  });

  it("should return an error if name is missing", (done) => {
    const newPet = {
      name: undefined,
      type: "d",
      picture_url: "http://example.com/buddy.jpg",
      chip: "1234567890",
      birthdate: "2020-01-01",
      gender: "m",
    };

    Pet.create(newPet, ownerId, (err, result) => {
      expect(err).toEqual({ kind: "content_not_found", content: "name" });
      expect(result).toBeNull();
      done();
    });
  });

  it("should return an error if type is missing", (done) => {
    const newPet = {
      name: "Buddy",
      picture_url: "http://example.com/buddy.jpg",
      chip: "1234567890",
      birthdate: "2020-01-01",
      gender: "m",
    };

    Pet.create(newPet, ownerId, (err, result) => {
      expect(err).toEqual({ kind: "content_not_found", content: "type" });
      expect(result).toBeNull();
      done();
    });
  });

  it("should return an error if gender is missing", (done) => {
    const newPet = {
      name: "Buddy",
      type: "d",
      picture_url: "http://example.com/buddy.jpg",
      chip: "1234567890",
      birthdate: "2020-01-01",
    };

    Pet.create(newPet, ownerId, (err, result) => {
      expect(err).toEqual({ kind: "content_not_found", content: "gender" });
      expect(result).toBeNull();
      done();
    });
  });

  it("should return an error if name is too long", (done) => {
    const newPet = {
      name: "BuddyBuddyBuddyBuddyBuddy",
      type: "d",
      picture_url: "http://example.com/buddy.jpg",
      chip: "1234567890",
      birthdate: "2020-01-01",
      gender: "m",
    };

    Pet.create(newPet, ownerId, (err, result) => {
      expect(err).toEqual({ kind: "content_too_long", content: "name" });
      expect(result).toBeNull();
      done();
    });
  });

  it("should return an error if type is invalid", (done) => {
    const newPet = {
      name: "Buddy",
      type: "x",
      picture_url: "http://example.com/buddy.jpg",
      chip: "1234567890",
      birthdate: "2020-01-01",
      gender: "m",
    };

    Pet.create(newPet, ownerId, (err, result) => {
      expect(err).toEqual({ kind: "content_invalid", content: "type" });
      expect(result).toBeNull();
      done();
    });
  });

  it("should return an error if gender is invalid", (done) => {
    const newPet = {
      name: "Buddy",
      type: "d",
      picture_url: "http://example.com/buddy.jpg",
      chip: "1234567890",
      birthdate: "2020-01-01",
      gender: "x",
    };

    Pet.create(newPet, ownerId, (err, result) => {
      expect(err).toEqual({ kind: "content_invalid", content: "gender" });
      expect(result).toBeNull();
      done();
    });
  });
});

describe("Pet Routes", () => {
  it("POST /pets should create a pet successfully", async () => {
    const newPet = {
      name: "Buddy",
      type: "d",
      gender: "m",
      birthdate: "2020-01-01",
      // Ajoutez d'autres champs requis selon votre modèle
    };

    const response = await request(app)
      .post("/pets")
      .set("Authorization", `Bearer ${token}`)
      .send(newPet);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newPet.name);
    // Ajoutez d'autres assertions selon les champs que vous vous attendez à recevoir en réponse
  });

  // it("GET /pets/:userId should return a list of pets for a user", async () => {
  //   const response = await request(app)
  //     .get(`/pets/${ownerId}`)
  //     .set("Authorization", `Bearer ${token}`);

  //   expect(response.status).toBe(200);
  //   expect(response.body.length).toBeGreaterThan(0); // Assurez-vous que des animaux sont récupérés
  //   // Ajoutez d'autres assertions selon les données que vous vous attendez à recevoir en réponse
  // });

  it("DELETE /pets/:petId should delete a pet successfully", async () => {
    const response = await request(app)
      .delete(`/pets/${petId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
    // Vérifiez que l'animal a été supprimé en effectuant une requête GET pour vérifier sa non-existence
    // ou vérifiez le statut de la suppression si votre application renvoie un message spécifique
  });
});

// describe("POST /pets", () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("should create a pet successfully", async () => {
//     const newPet = {
//       name: "Buddy",
//       type: "d",
//       picture_url: "http://example.com/buddy.jpg",
//       chip: "1234567890",
//       birthdate: "2020-01-01",
//       gender: "m",
//     };

//     // Mock the database query response
//     database.query.mockImplementation((query, values, callback) => {
//       callback(null, { insertId: 1 });
//     });

//     const response = await request(app)
//       .post("/pets")
//       .set("Authorization", `Bearer ${token}`)
//       .send(newPet);

//     expect(response.status).toBe(201);
//     expect(response.body).toEqual({
//       id: 1,
//       ...newPet,
//       user_id: ownerId,
//     });
//   });

//   it("should return an error if user is not logged in", async () => {
//     const newPet = {
//       name: "Buddy",
//       type: "d",
//       picture_url: "http://example.com/buddy.jpg",
//       chip: "1234567890",
//       birthdate: "2020-01-01",
//       gender: "m",
//     };

//     const response = await request(app)
//       .post("/pets")
//       .send(newPet);

//     expect(response.status).toBe(401);
//     expect(response.body).toEqual({
//       message: "You must be logged in to access this resource.",
//     });
//   });

//   it("should return an error if name is missing", async () => {
//     const newPet = {
//       type: "d",
//       picture_url: "http://example.com/buddy.jpg",
//       chip: "1234567890",
//       birthdate: "2020-01-01",
//       gender: "m",
//     };

//     const response = await request(app)
//       .post("/pets")
//       .set("Authorization", `Bearer ${token}`)
//       .send(newPet);

//     // expect(response.status).toBe(400);
//     expect(response.body).toEqual({
//       message: { content: "name", kind: "content_not_found" },
//     });
//   });

//   it("should return an error if type is invalid", async () => {
//     const newPet = {
//       name: "Buddy",
//       type: "x", // invalid type
//       picture_url: "http://example.com/buddy.jpg",
//       chip: "1234567890",
//       birthdate: "2020-01-01",
//       gender: "m",
//     };

//     const response = await request(app)
//       .post("/pets")
//       .set("Authorization", `Bearer ${token}`)
//       .send(newPet);

//     expect(response.status).toBe(400);
//     expect(response.body).toEqual({ message: { content: "type", kind: "content_invalid" }});
//   });

//   it("should return an error if gender is invalid", async () => {
//     const newPet = {
//       name: "Buddy",
//       type: "d",
//       picture_url: "http://example.com/buddy.jpg",
//       chip: "1234567890",
//       birthdate: "2020-01-01",
//       gender: "x",
//     };

//     const response = await request(app)
//       .post("/pets")
//       .set("Authorization", `Bearer ${token}`)
//       .send(newPet);

//     expect(response.status).toBe(400);
//     expect(response.body).toEqual({
//       message: { content: "gender", kind: "content_invalid" },
//     });
//   });
// });

describe("Pet Security", () => {
  it("should not store XSS content in the database", async () => {
    const maliciousInput = {
      name: "Buddy",
      picture_url: "<script>alert('XSS')</script>",
      type: "d",
      gender: "m",
    };

    const response = await request(app)
      .post("/pets")
      .set("Authorization", `Bearer ${token}`)
      .send(maliciousInput);

    // Should return 201 Created
    expect(response.status).toBe(201);

    // Shouldn't contain the XSS payload
    expect(response.body.picture_url).not.toContain("<script>");
  });
});
