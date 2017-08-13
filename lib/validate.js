const validator = require('validator');

module.exports = {
  isString: value => value && typeof value === 'string' && value.trim(),
  isEmail: value => validator.isEmail(`${value}`),
  normalizeEmail: value => validator.normalizeEmail(value)
};
