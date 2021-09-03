const Model = require('app/models/user');

const createUser = async (displayName, address) => {
  const currTime = Date.now();

  const query = {
    address: address
  };
  const update = {
    display_name: displayName,
    address: address,
    updated_at: currTime,
  };
  const options = {
    upsert: true,
  }

  const doc = await Model.update(query, update, options)

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

const getUserByAddress = async (address) => {
  const result = await Model.findOne(
    {
      address: address,
    },
    {
      _id: 1,
      display_name: 1,
      role: 1,
      created_at: 1,
      updated_at: 1,
    }
  ).exec();

  return result ? result._doc : result;
}

const getUserByDisplayName = async (displayName) => {
  const result = await Model.findOne(
    {
      display_name: displayName,
    },
    {
      _id: 1,
      display_name: 1,
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

  return result != null ? 1 : 0;
}

const deleteUser = async (userId) => {
  const doc = await Model.findOneAndDelete({ _id: userId }).exec();
  return doc == null ? 0 : 1;
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByDisplayName,
  getUserByAddress,
  updateUser,
  deleteUser
}
