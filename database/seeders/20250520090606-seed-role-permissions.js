'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('role_permissions', [
      { roleId: 1, permissionId: 1 }, // user - create:service
      { roleId: 1, permissionId: 4 }, // user - view:dashboard
      { roleId: 2, permissionId: 1 }, // admin - all
      { roleId: 2, permissionId: 2 },
      { roleId: 2, permissionId: 3 },
      { roleId: 2, permissionId: 4 },
      { roleId: 2, permissionId: 5 },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  },
};
