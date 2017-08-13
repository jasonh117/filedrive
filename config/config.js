module.exports = {
  development: {
    username: process.env.PGUSER || 'file_hosting',
    password: process.env.PGPASSWORD || null,
    database: process.env.PGDATABASE || 'file_hosting_dev',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: process.env.PGUSER || 'file_hosting',
    password: process.env.PGPASSWORD || null,
    database: process.env.PGDATABASE || 'file_hosting_test',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: '127.0.0.1',
    dialect: 'postgres'
  }
};
