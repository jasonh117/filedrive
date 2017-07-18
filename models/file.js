const tableName = 'files';

module.exports = (sequelize, DataTypes) => {
  const FileModel = sequelize.define(tableName, {
    originalname: {
      type: DataTypes.STRING
    },
    filename: {
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
    },
    encoding: {
      type: DataTypes.STRING
    },
    folder: {
      type: DataTypes.STRING
    }
  });

  FileModel.associate = (models) => {
    FileModel.belongsTo(models.User);
  };

  return FileModel;
};
