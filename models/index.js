const Sequelize = require('sequelize');
const nconf = require('nconf');

const postgresConfig = nconf.get('postgres');
const postgresDatabase = nconf.get('PGDATABASE');
const postgresUser = nconf.get('PGUSER');
const postgresPassword = nconf.get('PGPASSWORD');

const sequelize = new Sequelize(
  postgresDatabase,
  postgresUser,
  postgresPassword,
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
