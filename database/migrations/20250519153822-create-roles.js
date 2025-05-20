'use strict';

/** @type {import('sequelize-cli').Migration} */


    module.exports = {
      up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('roles', {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
        });
      },

      down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('roles');
      },
    };

  