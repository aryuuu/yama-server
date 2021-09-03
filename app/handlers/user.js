const bcrypt = require('bcrypt');
const jwt = require('app/utils/jwt');
const { assertNotNull } = require('app/utils/validator');
const { toArrayInteger } = require('app/utils/converter');
const { getOnlyDefinedFields } = require('app/utils/picker');

const userRepo = require('app/repositories/user');
const ServiceError = require('app/utils/service-error');

const salt = bcrypt.genSaltSync(10);

const createUser = async (data) => {
  // assertNotNull(data, 'display_name');
  assertNotNull(data, 'address');

  if (data.display_name === undefined || data.display_name === '') {
    data.display_name = data.address;
  }

  const result = userRepo.createUser(data.display_name, data.address);

  return result;
}

const authenticateUserByUsername = async (username, password) => {
  const user = await userRepo.getUserByUsername(username);

  if (!user._id) {
    throw new ServiceError(400, `user ${username} does not exist`);
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (isMatch) {
    const accessToken = jwt.createToken({
      id: user._id, 
    });
    const refreshToken = jwt.createToken({
      id: user._id,
    },
    'refresh'
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  } else {
    throw new ServiceError(400, `wrong password`);
  }
}

const getUsers = (query = {}) => {
  const options = {
    ids_user: query.ids ? toArrayInteger(query.ids) : null,
  }

  const users = userRepo.getUsers(options);

  return users;
}

const getUserByIdentifier = async (identifier) => {

}

const getUserByAddress = async (address) => {
  const user = userRepo.getUserByAddress(address);

  return user;
}

const updateUser = async (userId, data) => {
  const filteredData = getOnlyDefinedFields(
    data,
    [
      'display_name',
    ]
  );

  const result = userRepo.updateUser(userId, filteredData);

  return result;
}

const deleteUser = async (userId) => {
  return userRepo.deleteUser(userId);
}

module.exports = {
  createUser,
  authenticateUserByUsername,
  getUsers,
  getUserByIdentifier,
  getUserByAddress,
  updateUser,
  deleteUser,
}
