const User = require('../models/users');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');
const helper = require('./test_helper');
const api = supertest(app);

describe('user testing', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('root123', 10);
    const user = new User({
      username: 'root',
      name: 'root',
      passwordHash,
    });
    await user.save();
  });

  test('a new user is created', async () => {
    const newUser = {
      username: 'Antony',
      name: 'Antony',
      password: 'root123',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('unique user', async () => {
    const newUser = {
      username: 'root',
      name: 'root',
      password: 'root123',
    };
    const result = await api.post('/api/users').send(newUser).expect(400);
    expect(result.body.error).toContain('expected `username` to be unique');
  });

  test('required password', async () => {
    const user = {
      username: 'Bush',
      name: 'bu',
    };
    const usersInDb = await helper.usersInDb();
    const result = await api.post('/api/users').send(user).expect(400);
    expect(result.body.error).toContain('required password');
    const usersInDbAfter = await helper.usersInDb();
    expect(usersInDb.length).toEqual(usersInDbAfter.length);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
