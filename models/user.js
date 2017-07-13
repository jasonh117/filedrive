const tableName = 'users';
const passwordUtils = require('../lib/password');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(tableName, {
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING(72),
      set(val) {
        this.setDataValue('password', passwordUtils.hashPassword(val));
      }
    }
  });

  User.prototype.comparePassword = function comparePassword(password) {
    return passwordUtils.comparePassword(password.trim(), this.password);
  };

  User.prototype.toJSON = function toJSON() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  return User;
};
