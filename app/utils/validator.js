const ServiceError = require('app/utils/service-error');

const assertNotNull = (object, field) => {
  if (object[field] == null) {
    throw new ServiceError(400, `${field} should not be null`);
  }
}

module.exports = {
  assertNotNull,
}
