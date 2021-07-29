const toArrayInteger = (string) => {
  const result = string.split(',')
    .map(val => parseInt(val))
    .filter(val => val !== NaN);

  return result;
}

module.exports = {
  toArrayInteger
}
