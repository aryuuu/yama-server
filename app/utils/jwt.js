const jwt = require('jsonwebtoken');
const config = require('config');
const ServiceError = require('app/utils/service-error');

const createToken = (payload, type = 'access') => {
  
  const secret = type === 'refresh' 
    ? config.REFRESH_TOKEN_SECRET 
    : config.ACCESS_TOKEN_SECRET;
  const expiresIn = type === 'refresh'
    ? config.REFRESH_TOKEN_EXPIRATION
    : config.ACCESS_TOKEN_EXPIRATION;

  return jwt.sign(
    payload,
    secret,
    {
      expiresIn: expiresIn,
    }
  );
}

const verifyToken = (token, type = 'access') => {
  const secret = type === 'refresh' 
    ? config.REFRESH_TOKEN_SECRET 
    : config.ACCESS_TOKEN_SECRET;

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      throw new ServiceError(400, `${type} token expired`);
    }
    throw new ServiceError(422, 'Invalid token');
  }
}

module.exports = {
  createToken,
  verifyToken,
}
