const tableName = 'files';

module.exports = (sequelize, DataTypes) => {
  const FileModel = sequelize.define(tableName, {
    name: {
      type: DataTypes.STRING
    },
    permission: {
      type: DataTypes.STRING
    },
    size: {
      type: DataTypes.STRING
    },
    mimetype: {
      type: DataTypes.STRING
    }
  });

  FileModel.associate = (models) => {
    FileModel.belongsTo(models.User);
  };

  return FileModel;
};
