const tableName = 'files';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      originalname: {
        type: Sequelize.STRING
      },
      filename: {
        type: Sequelize.STRING
      },
      permission: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.STRING
      },
      mimetype: {
        type: Sequelize.STRING
      },
      encoding: {
        type: Sequelize.STRING
      },
      folder: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
      .then(() => queryInterface.addIndex(tableName, ['userId', 'folder']))
      .then(() => queryInterface.addIndex(tableName, ['userId', 'filename']))
      .then(() => queryInterface.addIndex(
        tableName,
        ['originalname', 'userId', 'folder'],
        { indicesType: 'UNIQUE' }
      )),
  down: queryInterface =>
    queryInterface.dropTable(tableName, { cascade: true, truncate: true })
};
