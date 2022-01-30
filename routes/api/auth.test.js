const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();

// const {
//   describe,
//   beforeAll,
//   afterAll,
//   beforeEach,
//   afterEach,
//   test,
//   expect,
// } = require("jest");

const app = require("../../app");

const { DB_TEST_HOST } = process.env;

describe("test users", () => {
  let server;

  beforeAll(() => (server = app.listen(3000)));
  afterAll(() => server.close());

  beforeEach((done) => {
    mongoose.connect(DB_TEST_HOST).then(() => done());
  });
  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });

  test("test login route", async () => {
    const loginUser = {
      name: "Miranda",
      email: "reqspa@mail.com",
    };

    const response = await request(app).post("/api/auth/login").send(loginUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Login success!");

    expect(response.body.token).toBeTruthy();
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
  });
});
