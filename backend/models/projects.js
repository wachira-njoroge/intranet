'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Projects.belongsTo(models.Departments,{
        foreignKey: "departmentId", as: "department"
      });
      Projects.hasMany(models.Tasks,{
        foreignKey: "projectId", as: "project"
      })
    }
  };
  Projects.init({
    name:  {
      type: DataTypes.STRING,
      unique: true
    },
    description:  {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM,
      values: ["new","in progress","closed","complete"],
      defaultValue: "new"
    },
    start_time:  {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    end_time:  {
      type: DataTypes.DATE
    },
    departmentId:  {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Projects',
  });
  return Projects;
};