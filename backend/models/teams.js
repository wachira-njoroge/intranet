'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teams extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Teams.hasMany(models.Users,{
        foreignKey: "teamId", as: "team"
      });
    }
  };
  Teams.init({
    name:  {
      type: DataTypes.STRING,
      unique: true
    },
    deliverable:  {
      type: DataTypes.STRING
    },
    description:  {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Teams',
  });
  return Teams;
};