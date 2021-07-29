const Model = require('app/models/user');

const createUser = async (username, password, address) => {
  const currTime = Date.now();

  const doc = await Model.create({
    username: username,
    password: password,
    address: address,
    created_at: currTime,
    updated_at: currTime,
  });

  return { created_at: currTime, user_id: doc._id };
}

const getUsers = async (options = {}) => {
  const users = await Model.find(
    {},
    {
      _id: 1,
      username: 1,
      address: 1,
      created_at: 1,
      updated_at: 1
    }
  );

  return users;
}

const getUserById = async (userId) => {
  const user = await Model.findOne(
    {
      _id: userId
    }, 
    {
      _id: 1,
      username: 1,
      password: 1,
      address: 1,
      created_at: 1,
      updated_at: 1
    }
  );

  return user ? user._doc : user;
}

const getUserByUsername = async (username) => {
  const result = await Model.findOne(
    {
      username: username,
    },
    {
      _id: 1,
      username: 1,
      password: 1,
      role: 1,
      created_at: 1,
      updated_at: 1,
    }
  ).exec();

  return result ? result._doc : result;
}

const updateUser = async (userId, data) => {
  data.updated_at = Date.now();

  const result = await Model.findOneAndUpdate(
    {
    _id: userId
    },
    {
      $set: data
    },
  ).exec();

  return result != null ? 1 : 0;8
}

const deleteUser = async (userId) => {
  const doc = await Model.findOneAndDelete({ _id: userId }).exec();
  return doc == null ? 0 : 1;
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser
}
