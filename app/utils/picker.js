const getOnlyDefinedFields = (obj, fields) => {
  const result = {};

  fields.forEach(field => {
    if (obj[field] !== undefined) {
      result[field] = obj[field];
    }
  });

  return result;
}

const getSpecifiedFields = (obj, fields) => {
  const result = {};

  fields.forEach(field => {
    result[field] = obj[field];
  });

  return result;
}

const excludeFields = (obj, fields) => {
  const result = {...obj};
  
  fields.forEach(field => {
    delete result[field];
  })

  return result;
}

module.exports = {
  getOnlyDefinedFields,
  getSpecifiedFields,
  excludeFields,
}
