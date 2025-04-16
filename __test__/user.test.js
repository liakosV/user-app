const mongoose = require('mongoose');
const request = require('supertest');

const authService = require('../services/auth.service')

const app = require('../app');
// require('dotenv').config();

// Connecting to MongoDB before each test
beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  .then(
    () => {console.log("Connection to MongoDb established for Jest")},
    err => {console.log("Failed to connect to MongoDb for Jest", err)}
  )
})

//Close connection to MongoDb
afterEach(async () => {
  await mongoose.connection.close();
})

describe("Request for /api/users", () => {

  let token;

  beforeAll(() => {
    user = {
      username: "admin",
      email: "admin@aueb.gr",
      roles: ["EDITOR", "READER", "ADMIN"]
    }
    token = authService.generateAccessToken(user)
  })

  it("GET Returns all users", async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  })
});