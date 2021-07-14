'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tasks.belongsTo(models.Users,{
        foreignKey: "userId", as: "user"
      });
      Tasks.belongsTo(models.Projects, {
        foreignKey: "projectId", as: "project"
      });
    }
  };
  Tasks.init({
    name: {
        type: DataTypes.STRING,
    },
    description:  {
      type: DataTypes.STRING
    },
    status:{
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
    userId:  {
      type: DataTypes.INTEGER
    },
    projectId:  {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Tasks',
  });
  return Tasks;
};