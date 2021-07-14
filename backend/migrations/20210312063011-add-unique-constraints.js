'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users","username",{
        type: Sequelize.STRING,
        unique: true
    });
    await queryInterface.changeColumn("Users","email",{
      type: Sequelize.STRING,
      unique: true
    })
    await queryInterface.changeColumn("Departments","name",{
      type: Sequelize.STRING,
      unique: true
    });
    await queryInterface.changeColumn("Projects","name",{
      type: Sequelize.STRING,
      unique: true
    });
    await queryInterface.changeColumn("Teams","name",{
      type: Sequelize.STRING,
      unique: true
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users","username",{
      type: Sequelize.STRING,
      unique: false
    });
    await queryInterface.changeColumn("Users","email",{
      type: Sequelize.STRING,
      unique: false
    })
    await queryInterface.changeColumn("Departments","name",{
      type: Sequelize.STRING,
      unique: false
    });
    await queryInterface.changeColumn("Projects","name",{
      type: Sequelize.STRING,
      unique: true
    });
    await queryInterface.changeColumn("Teams","name",{
      type: Sequelize.STRING,
      unique: true
    });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
