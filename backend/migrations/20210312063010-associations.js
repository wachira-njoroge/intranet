'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users","departmentId",{
        type: Sequelize.INTEGER,
        references:{
            model: 'Departments',
            key: 'id'
        },
        onDelete: 'SET NULL'
    });
    await queryInterface.changeColumn("Users","teamId",{
      type: Sequelize.INTEGER,
      references:{
          model: 'Teams',
          key: 'id'
      },
      onDelete: 'SET NULL'
    });
    await queryInterface.changeColumn("Tasks","userId",{
      type: Sequelize.INTEGER,
      references:{
          model: 'Users',
          key: 'id'
      },
      onDelete: 'SET NULL'
    });
    await queryInterface.changeColumn("Tasks","projectId",{
      type: Sequelize.INTEGER,
      references:{
          model: 'Projects',
          key: 'id'
      },
      onDelete: 'SET NULL'
    });
    await queryInterface.changeColumn("Projects","departmentId",{
      type: Sequelize.INTEGER,
      references:{
          model: 'Departments',
          key: 'id'
      },
      onDelete: 'SET NULL'
    });
    await queryInterface.changeColumn("Users","roleId",{
      type: Sequelize.INTEGER,
      references: {
        model: 'Roles',
        key: 'id'
      }
    });
    await queryInterface.changeColumn("Privileges", "roleId",{
        type: Sequelize.INTEGER,
        references: {
          model: 'Roles',
          key: 'id'
        }
    });
    await queryInterface.changeColumn("Privileges","resourceId",{
      type: Sequelize.INTEGER,
      references: {
        model: 'Resources',
        key: 'id'
      }
    });
    await queryInterface.changeColumn("Privileges","permissionId",{
      type: Sequelize.INTEGER,
      references: {
        model: 'Permissions',
        key:'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users","departmentId",{
        type: Sequelize.INTEGER
    });
    await queryInterface.changeColumn("Users","teamId",{
      type: Sequelize.INTEGER
    });
  await queryInterface.changeColumn("Tasks","userId",{
    type: Sequelize.INTEGER
    });
  await queryInterface.changeColumn("Tasks","projectId",{
    type: Sequelize.INTEGER
    });
  await queryInterface.changeColumn("Projects","departmentId",{
    type: Sequelize.INTEGER
    });
    await queryInterface.changeColumn("Privileges","roleId",{
      type: Sequelize.INTEGER
      });
      await queryInterface.changeColumn("Privileges","resourceId",{
        type: Sequelize.INTEGER
        });
        await queryInterface.changeColumn("Privileges","permissionId",{
          type: Sequelize.INTEGER
          });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
