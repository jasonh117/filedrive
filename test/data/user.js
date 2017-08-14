const { hashPassword } = require('../../lib/password');

const user1Seed = {
  id: 100,
  email: 'hue@gmail.com',
  password: hashPassword('hue'),
  createdAt: new Date(),
  updatedAt: new Date()
};

const user1 = {
  email: 'hue@gmail.com',
  password: 'hue'
};

const user2Seed = {
  id: 101,
  email: 'huehuehue@gmail.com',
  password: hashPassword('huehuehue'),
  createdAt: new Date(),
  updatedAt: new Date()
};

const user2 = {
  email: 'huehuehue@gmail.com',
  password: 'huehuehue'
};

const users = [user1Seed, user2Seed];

module.exports = {
  user1,
  user2,
  users
};
