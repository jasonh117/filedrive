const Sequelize = require('sequelize');
const nconf = require('nconf');

const postgresConfig = nconf.get('postgres');

const sequelize = new Sequelize(
  postgresConfig.database,
  postgresConfig.username,
  postgresConfig.password,
  postgresConfig.options
);

const db = {
  sequelize,
  Sequelize,
  User: sequelize.import('./user'),
  File: sequelize.import('./file')
};

db.File.associate(db);

module.exports = db;
