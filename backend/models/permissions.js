'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Permissions.init({
    name: DataTypes.STRING,
    can_view: DataTypes.BOOLEAN,
    can_edit: DataTypes.BOOLEAN,
    can_create: DataTypes.BOOLEAN,
    can_delete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Permissions',
  });
  return Permissions;
};