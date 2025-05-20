Role.associate = (models) => {
  Role.belongsToMany(models.Permission, {
    through: 'role_permissions',
    foreignKey: 'roleId',
  });
};
