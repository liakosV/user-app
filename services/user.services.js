const User = require('../models/user.model');

function findAll() {
  const result = User.find();
  return result;
}

function findOne() {
  const result = User.findOne();
  return result;
}

module.exports = {findAll, findOne}