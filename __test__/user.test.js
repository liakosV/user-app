const mongoose = require('mongoose');
const request = require('supertest');

const authService = require('../services/auth.service')
const userService = require('../services/user.services');

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

describe("Reaquest for /api/users with faulty authentication", () => {
  let token;
  let noRolesToken;
  let noToken;

  beforeAll(() => {
    user = {
      username: "admin",
      email: "admin@aueb.gr",
      roles: ["EDITOR", "READER"]
    }
    userNoRoles = {
      username: "Noadmin",
      email: "admin@aueb.gr"
    }
    noRolesToken = authService.generateAccessToken(userNoRoles)
    token = authService.generateAccessToken(user)  
  })

  it("GET Returns all users with payload Error", async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${noToken}`)

    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy();
  });

  it("GET Returns all users with no token", async () => {
    const res = await request(app)
      .get('/api/users')
      // .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy();
  });

  it("GET Returns a user with no role", async () => {
    const res = await request(app)
      .get('/api/users/user1')
      .set('Authorization', `Bearer ${noRolesToken}`)

    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy();
  });

  it("GET Returns a user with forbidden role", async () => {
    const res = await request(app)
      .get('/api/users/user1')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy();
  });


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
  });

  it("POST Creates a user", async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        'username': 'test5',
        'password': '12345',
        'name': 'name5',
        'surname': 'test5',
        'email': 'test5@aueb.gr',
        'address': {
          'area': 'area5',
          'road': 'road5'
        },
        'phone': [
          {
            'type': 'mobile',
            'number': 2393922
          }
        ]
      })
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy();
  }, 100000);

  it("POST Creates a user that exist", async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        'username': 'test5',
        'password': '12345',
        'name': 'name5',
        'surname': 'test5',
        'email': 'test5@aueb.gr',
        'address': {
          'area': 'area5',
          'road': 'road5'
        },
        'phone': [
          {
            'type': 'mobile',
            'number': 2393922
          }
        ]
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.status).not.toBeTruthy();
  }, 100000);

  it("Post Creates a user with same email", async() => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username:'test6',
        password: '12345',
        name:'name test6',
        surname:'surname test6',
        email:'test5@aueb.gr',
        address:{
          area:'area23',
          road:'road23'
        },
        'phone': [
          {
            'type': 'mobile',
            'number': 2393922
          }
        ]
      })
      expect(res.statusCode).toBe(400);
      expect(res.body.status).not.toBeTruthy();
  }, 10000);

  it("POST Creates a user with empty surname, name, password", async()=>{
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'test6',
        password:'',
        name:'',
        surname:'',
        email:'test6@aueb.gr',
        address: {
          area: 'area23',
          road: 'road23'
        },
        'phone': [
          {
            'type': 'mobile',
            'number': 2393922
          }
        ]
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).not.toBeTruthy();
  })
});

describe("Request for /api/users/:username", () => {
  let token;

  beforeAll(() => {
    user = {
      username: "admin",
      email: "admin@aueb.gr",
      roles: ["EDITOR", "READER", "ADMIN"]
    }
    token = authService.generateAccessToken(user)
  })

  it("GET returns specific user", async () => {
    const result = await userService.findLastInsertedUser();
    // console.log("RESULT>>>", result)

    const res = await request(app)
      .get('/api/users/'+result.username)
      .set('Authorization', `Bearer ${token}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy();
    expect(res.body.data.username).toBe(result.username);
    expect(res.body.data.email).toBe(result.email)
  })

  it("PATCH Updates a user", async () => {
    const res = await request(app)
      .patch('/api/users/test5')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'test5',
        name: 'lakis',
        surname: 'lalakis',
        email: 'test77@aueb.gr',
        address: {
          area: 'area77',
          road: 'road77'
        }
      })
    expect(res.statusCode).toBe(200)
    expect(res.status).toBeTruthy
  }, 50000)

  it("DELETE Deletes a user", async () => {
    
    const res = await request(app)
      .delete('/api/users/test5')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.status).toBeTruthy
  })
});