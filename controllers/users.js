const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/users');

userRouter.post('/', async (request, response) => {
  const user = request.body;
  if (user.password === undefined) {
    return response.status(400).json({ error: 'required password' });
  } else if (user.password.length < 3)
    return response.status(400).json({ error: 'min length is 3' });
  const passwordHash = await bcrypt.hash(user.password, 10);
  const savedUser = new User({
    username: user.username,
    name: user.name,
    passwordHash,
  });
  const result = await savedUser.save();
  response.status(201).json(result);
});

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  });
  response.json(users);
});

module.exports = userRouter;
