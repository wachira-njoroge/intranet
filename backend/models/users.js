'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.belongsTo(models.Departments,{
        foreignKey: "departmentId", as: "department"
      });
      Users.belongsTo(models.Teams,{
        foreignKey: "teamId", as: "team"
      });
      Users.belongsTo(models.Roles,{
        foreignKey: "roleId", as: "role"
      })
    }
  };
  Users.init({
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type:DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING,
      unique:true
    },
    contact:  {
      type: DataTypes.STRING
    },
    password:  {
      type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    departmentId:  {
      type: DataTypes.INTEGER
    },
    teamId:{
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};