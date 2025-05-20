User.belongsTo(models.Role, {
  foreignKey: 'roleId',
  as: 'role',
});
