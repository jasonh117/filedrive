const tableName = 'users';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING(72)
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    })
      .then(() => queryInterface.addIndex(tableName, ['email'], { indexName: 'u_email', indicesType: 'UNIQUE' })),
  down: queryInterface =>
    queryInterface.dropTable(tableName, { cascade: true, truncate: true })
};
