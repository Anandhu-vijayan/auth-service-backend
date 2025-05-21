// role.model.js
export const Role = (sequelize, DataTypes) => {
  const RoleModel = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  RoleModel.associate = (models) => {
    RoleModel.belongsToMany(models.Permission, {
      through: 'role_permissions',
      foreignKey: 'roleId',
    });
  };

  return RoleModel;
};
