'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      { id: 1, name: 'create:service', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'edit:service', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'delete:service', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'view:dashboard', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'manage:users', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};

