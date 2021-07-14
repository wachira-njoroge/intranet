'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Departments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Departments.hasMany(models.Users, {
        foreignKey: "departmentId", as: "department"
      });
    }
  };
  Departments.init({
    name:  {
      type: DataTypes.STRING,
      unique: true
    },
    manager:{
      type: DataTypes.INTEGER,
      unique: true
    },
    status:  {
      type: DataTypes.STRING
    },
    tagline:  {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Departments',
  });
  return Departments;
};