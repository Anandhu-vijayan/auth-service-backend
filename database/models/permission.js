Permission.associate = (models) => {
  Permission.belongsToMany(models.Role, {
    through: 'role_permissions',
    foreignKey: 'permissionId',
  });
};
