const { users } = require('../test/data/user');

const tableName = 'users';

module.exports = {
  up: (queryInterface, Sequelize) => { // eslint-disable-line
    return queryInterface.bulkInsert(tableName, users);
  },

  down: (queryInterface, Sequelize) => { // eslint-disable-line
    return queryInterface.bulkDelete(tableName, null, { cascade: true, truncate: true });
  }
};
